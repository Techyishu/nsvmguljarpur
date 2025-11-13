import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBackgroundMusicSettings } from "@/services/content";

// Convert volume percentage (0-1) to a quieter logarithmic scale
// This makes lower volumes actually sound quieter
const applyVolumeCurve = (volume: number): number => {
  // Apply a logarithmic curve: volume^2.5 to make lower values much quieter
  // This means 0.1 (10%) becomes ~0.003 (0.3%), 0.5 (50%) becomes ~0.18 (18%)
  return Math.pow(Math.max(0, Math.min(1, volume)), 2.5);
};

export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef(false);
  const durationTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const endTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const { data: musicSettings } = useQuery({
    queryKey: ["backgroundMusicSettings"],
    queryFn: fetchBackgroundMusicSettings,
    refetchInterval: 30000, // Refetch every 30 seconds to check for updates
  });

  // Handle user interaction for autoplay - mobile-friendly version
  useEffect(() => {
    if (!musicSettings?.enabled || !musicSettings?.url || !audioRef.current) {
      return;
    }

    const handleUserInteraction = (event: Event) => {
      // Only handle if audio element exists and hasn't started playing yet
      if (!audioRef.current || hasAttemptedPlay.current) {
        return;
      }

      console.log('User interaction detected:', event.type, {
        readyState: audioRef.current.readyState,
        networkState: audioRef.current.networkState,
        paused: audioRef.current.paused,
      });

      // For mobile, ensure we're in a direct user interaction context
      // Mobile browsers require play() to be called directly from the event handler
      try {
        // Set start time if specified (but only if audio is ready)
        if (startTimeRef.current > 0 && audioRef.current.readyState >= 1) {
          audioRef.current.currentTime = startTimeRef.current;
        }

        // For mobile, we MUST call play() synchronously within the event handler
        // Don't wait for readyState - mobile browsers are more lenient if called from user gesture
        console.log('Attempting to play from user interaction, readyState:', audioRef.current.readyState);
        
        // Set start time if specified
        if (startTimeRef.current > 0 && audioRef.current.readyState >= 1) {
          audioRef.current.currentTime = startTimeRef.current;
        }
        
        // Call play() directly - mobile browsers allow this from user gesture even if not fully loaded
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playback started successfully from user interaction');
              hasAttemptedPlay.current = true;
              
              // Set up duration timer if specified
              if (durationRef.current > 0) {
                if (durationTimerRef.current) {
                  clearTimeout(durationTimerRef.current);
                }
                durationTimerRef.current = window.setTimeout(() => {
                  if (audioRef.current) {
                    audioRef.current.pause();
                    hasAttemptedPlay.current = false;
                  }
                  durationTimerRef.current = null;
                }, durationRef.current * 1000);
              }
            })
            .catch((error) => {
              console.warn("Playback error from user interaction:", {
                name: error.name,
                message: error.message,
                code: (error as any).code,
                readyState: audioRef.current?.readyState,
                networkState: audioRef.current?.networkState,
              });
              
              // If audio wasn't ready, try to load and play when ready
              if (audioRef.current && audioRef.current.readyState < 2) {
                console.log('Audio not ready, setting up load listener');
                const playWhenReady = () => {
                  if (audioRef.current && !hasAttemptedPlay.current) {
                    audioRef.current.play()
                      .then(() => {
                        console.log('Audio started after loading');
                        hasAttemptedPlay.current = true;
                      })
                      .catch((err) => {
                        console.warn('Failed to play after loading:', err);
                      });
                  }
                };
                audioRef.current.addEventListener('canplay', playWhenReady, { once: true });
                audioRef.current.addEventListener('canplaythrough', playWhenReady, { once: true });
                if (audioRef.current.readyState === 0) {
                  audioRef.current.load();
                }
              } else {
                // Permission or other error
                if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
                  hasAttemptedPlay.current = false;
                }
              }
            });
        }
      } catch (error) {
        console.warn("Error in user interaction handler:", error);
      }
    };


    // Listen for user interactions - mobile browsers need direct event handling
    // Use both capture and bubble phases, and handle touch events specifically
    const events = ["click", "touchstart", "touchend", "keydown", "mousedown"];
    events.forEach((event) => {
      // Use capture phase for better mobile compatibility
      document.addEventListener(event, handleUserInteraction, { 
        capture: true, 
        passive: true,
        once: false // Allow multiple attempts
      });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction, { capture: true });
      });
    };
  }, [musicSettings]);

  // Update timing refs when settings change
  useEffect(() => {
    if (musicSettings) {
      startTimeRef.current = musicSettings.startTime || 0;
      endTimeRef.current = musicSettings.endTime || 0;
      durationRef.current = musicSettings.duration || 0;
    }
  }, [musicSettings?.startTime, musicSettings?.endTime, musicSettings?.duration]);

  useEffect(() => {
    if (!musicSettings || !musicSettings.url || !musicSettings.enabled) {
      // Clean up if music is disabled or URL is empty
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        hasAttemptedPlay.current = false;
      }
      if (durationTimerRef.current) {
        clearTimeout(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      return;
    }

    // Create or update audio element
    if (!audioRef.current) {
      // Create audio element - for mobile, create as HTML element with attributes
      const audio = document.createElement('audio');
      audio.src = musicSettings.url;
      audio.preload = "auto";
      audio.volume = applyVolumeCurve(musicSettings.volume);
      
      // Mobile-specific attributes (important for iOS and Android)
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.setAttribute('crossorigin', 'anonymous');
      audio.setAttribute('preload', 'auto');
      
      // Enable range requests for better mobile streaming
      // This allows the browser to request specific byte ranges
      
      // Set loop behavior based on endTime
      audio.loop = !musicSettings.endTime || musicSettings.endTime === 0;
      
      // Add error handler for better debugging
      audio.addEventListener('error', (e) => {
        const error = audio.error;
        if (error) {
          console.error('Audio error details:', {
            code: error.code,
            message: error.message,
            MEDIA_ERR_ABORTED: error.MEDIA_ERR_ABORTED,
            MEDIA_ERR_NETWORK: error.MEDIA_ERR_NETWORK,
            MEDIA_ERR_DECODE: error.MEDIA_ERR_DECODE,
            MEDIA_ERR_SRC_NOT_SUPPORTED: error.MEDIA_ERR_SRC_NOT_SUPPORTED,
            url: musicSettings.url,
            userAgent: navigator.userAgent,
          });
        }
      });
      
      // Add load event handlers for mobile
      audio.addEventListener('loadstart', () => {
        console.log('Audio load started');
      });
      
      audio.addEventListener('loadeddata', () => {
        console.log('Audio data loaded');
      });
      
      audio.addEventListener('canplay', () => {
        console.log('Audio can play');
      });
      
      // Explicitly load for mobile compatibility
      audio.load();
      
      audioRef.current = audio;

      // Handle timeupdate to check for endTime
      audioRef.current.addEventListener("timeupdate", () => {
        if (!audioRef.current) return;
        
        const currentTime = audioRef.current.currentTime;
        const startTime = startTimeRef.current;
        const endTime = endTimeRef.current;
        
        // If endTime is set and we've reached it, loop back to startTime
        if (endTime > 0 && currentTime >= endTime) {
          audioRef.current.currentTime = startTime;
        }
        
        // If startTime is set and we're before it, jump to startTime
        if (startTime > 0 && currentTime < startTime) {
          audioRef.current.currentTime = startTime;
        }
      });

      // Handle when audio ends (for duration-based stopping)
      audioRef.current.addEventListener("ended", () => {
        // If duration is set, we handle stopping via timer
        // Otherwise, if loop is false and we reach the end, stop
        if (!audioRef.current?.loop && durationRef.current === 0) {
          audioRef.current.pause();
        }
      });

      // Don't try autoplay immediately - browsers block it
      // User interaction handlers are set up in the separate useEffect above
      // This ensures music only plays after user interaction
    } else {
      // Update source if URL changed
      const currentUrl = audioRef.current.src || audioRef.current.getAttribute('src');
      const newUrl = musicSettings.url;
      
      if (currentUrl !== newUrl) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.pause();
        
        // Update source
        audioRef.current.src = newUrl;
        
        // Ensure mobile attributes are still set
        audioRef.current.setAttribute('playsinline', 'true');
        audioRef.current.setAttribute('webkit-playsinline', 'true');
        
        // Reload for mobile compatibility
        audioRef.current.load();
        hasAttemptedPlay.current = false;
        
        // Clear any existing duration timer
        if (durationTimerRef.current) {
          clearTimeout(durationTimerRef.current);
          durationTimerRef.current = null;
        }
        
        // Update loop behavior
        audioRef.current.loop = !musicSettings.endTime || musicSettings.endTime === 0;
        
        // Try to resume playing if it was playing before (only after user interaction)
        // Don't auto-play on URL change - wait for user interaction
        if (wasPlaying) {
          // Reset so it can play again on next interaction
          hasAttemptedPlay.current = false;
        }
      }
      
      // Update volume with curve applied
      audioRef.current.volume = applyVolumeCurve(musicSettings.volume);
      
      // Update loop behavior if endTime changed
      const shouldLoop = !musicSettings.endTime || musicSettings.endTime === 0;
      if (audioRef.current.loop !== shouldLoop) {
        audioRef.current.loop = shouldLoop;
      }
    }

    return () => {
      // Don't clean up on every render, only on unmount
    };
  }, [musicSettings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        hasAttemptedPlay.current = false;
      }
      if (durationTimerRef.current) {
        clearTimeout(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    };
  }, []);

  // This component doesn't render anything - music plays in background
  return null;
};

