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
  const userHasInteractedRef = useRef(false);
  const durationTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const endTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);

  const { data: musicSettings } = useQuery({
    queryKey: ["backgroundMusicSettings"],
    queryFn: fetchBackgroundMusicSettings,
    refetchInterval: 30000, // Refetch every 30 seconds to check for updates
  });

  // Set up user interaction listeners IMMEDIATELY (not dependent on audio being ready)
  // This ensures we capture user interactions even before audio loads
  useEffect(() => {
    const handleUserInteraction = (event: Event) => {
      // Always mark that user has interacted
      userHasInteractedRef.current = true;
      
      // If music settings aren't ready or audio isn't ready, just record the interaction
      if (!musicSettings?.enabled || !musicSettings?.url || !audioRef.current) {
        return;
      }

      // Reset hasAttemptedPlay if audio is paused (allows retry)
      if (audioRef.current.paused && hasAttemptedPlay.current) {
        hasAttemptedPlay.current = false;
      }

      // Skip if already playing (no log spam)
      if (!audioRef.current.paused) {
        return;
      }

      // For mobile, ensure we're in a direct user interaction context
      // Mobile browsers require play() to be called directly from the event handler
      try {
        // Set start time if specified (but only if audio is ready)
        if (startTimeRef.current > 0 && audioRef.current.readyState >= 1) {
          audioRef.current.currentTime = startTimeRef.current;
        }

        // Call play() directly - mobile browsers allow this from user gesture even if not fully loaded
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
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
              // Only log if not a common autoplay error
              if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
                console.warn("Background music playback error:", error.name, error.message);
              }
              // Permission or other error - allow retry
              hasAttemptedPlay.current = false;
            });
        }
      } catch (error) {
        console.warn("Error in user interaction handler:", error);
      }
    };

    // Listen for user interactions IMMEDIATELY
    // Don't wait for audio to be ready - capture interactions early
    const events = ["click", "touchstart", "touchend", "keydown", "mousedown"];
    
    // Add to document
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { 
        capture: true, 
        passive: true,
        once: false // Allow multiple attempts
      });
    });
    
    // Also add to window for better mobile compatibility
    events.forEach((event) => {
      window.addEventListener(event, handleUserInteraction, { 
        capture: true, 
        passive: true,
        once: false
      });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction, { capture: true });
        window.removeEventListener(event, handleUserInteraction, { capture: true });
      });
    };
  }, [musicSettings]); // Still depend on musicSettings to re-attach when settings change

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
      
      // Add error handler (silent unless critical)
      audio.addEventListener('error', () => {
        const error = audio.error;
        if (error && error.code !== 1) { // Only log non-abort errors
          console.error('Background music error:', error.code);
        }
      });
      
      // Attempt autoplay when ready
      audio.addEventListener('canplay', () => {
        // Try to autoplay immediately when audio is ready (no user interaction required)
        if (audio.paused && !hasAttemptedPlay.current) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
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
              .catch(() => {
                // Autoplay blocked, will play on user interaction (silent)
                hasAttemptedPlay.current = false;
              });
          }
        }
      });
      
      audio.addEventListener('canplaythrough', () => {
        // Also try from canplaythrough if canplay didn't work
        if (audio.paused && !hasAttemptedPlay.current) {
          audio.play()
            .then(() => {
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
            .catch(() => {
              // Autoplay blocked (silent)
              hasAttemptedPlay.current = false;
            });
        }
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
        audioRef.current.pause();
        audioRef.current.src = newUrl;
        audioRef.current.setAttribute('playsinline', 'true');
        audioRef.current.setAttribute('webkit-playsinline', 'true');
        audioRef.current.load();
        hasAttemptedPlay.current = false;
        
        if (durationTimerRef.current) {
          clearTimeout(durationTimerRef.current);
          durationTimerRef.current = null;
        }
        
        audioRef.current.loop = !musicSettings.endTime || musicSettings.endTime === 0;
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

