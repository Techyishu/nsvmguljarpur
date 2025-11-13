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

      // For mobile, ensure we're in a direct user interaction context
      // Mobile browsers require play() to be called directly from the event handler
      try {
        // Set start time if specified
        if (startTimeRef.current > 0) {
          audioRef.current.currentTime = startTimeRef.current;
        }

        // Ensure audio is loaded (important for mobile)
        // readyState: 0=HAVE_NOTHING, 1=HAVE_METADATA, 2=HAVE_CURRENT_DATA, 3=HAVE_FUTURE_DATA, 4=HAVE_ENOUGH_DATA
        if (audioRef.current.readyState < 2) {
          // Audio not loaded yet, wait for it
          const playWhenReady = () => {
            attemptPlay();
          };
          audioRef.current.addEventListener('canplay', playWhenReady, { once: true });
          audioRef.current.addEventListener('canplaythrough', playWhenReady, { once: true });
          // Force load if not already loading
          if (audioRef.current.readyState === 0) {
            audioRef.current.load();
          }
          return;
        }

        // Audio is ready, attempt to play immediately
        attemptPlay();
      } catch (error) {
        console.warn("Error in user interaction handler:", error);
      }
    };

    const attemptPlay = () => {
      if (!audioRef.current || hasAttemptedPlay.current) {
        return;
      }

      // Attempt to play - must be called directly from user interaction on mobile
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
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
            // Log error for debugging (especially on mobile)
            console.warn("Background music playback error:", {
              name: error.name,
              message: error.message,
              userAgent: navigator.userAgent,
            });
            
            // Don't mark as attempted if it was a permission error
            // This allows retry on next interaction
            if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
              hasAttemptedPlay.current = false;
            } else {
              hasAttemptedPlay.current = true; // Other errors, don't retry
            }
          });
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
      
      // Mobile-specific attributes (important for iOS)
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.setAttribute('crossorigin', 'anonymous');
      
      // Set loop behavior based on endTime
      audio.loop = !musicSettings.endTime || musicSettings.endTime === 0;
      
      // Explicitly load for mobile compatibility
      audio.load();
      
      audioRef.current = audio;
      
      // Handle audio events
      audioRef.current.addEventListener("error", (e) => {
        console.error("Error loading audio:", e);
      });

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

