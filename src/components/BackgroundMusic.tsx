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

  // Handle user interaction for autoplay
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasAttemptedPlay.current && audioRef.current && musicSettings?.enabled && musicSettings?.url) {
        hasAttemptedPlay.current = true;
        
        // Set start time if specified
        if (startTimeRef.current > 0) {
          audioRef.current.currentTime = startTimeRef.current;
        }
        
        audioRef.current.play().then(() => {
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
        }).catch((error) => {
          console.error("Error playing background music:", error);
          hasAttemptedPlay.current = false;
        });
      }
    };

    // Listen for any user interaction
    const events = ["click", "touchstart", "keydown", "scroll"];
    events.forEach((event) => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserInteraction);
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
      audioRef.current = new Audio(musicSettings.url);
      // Apply volume curve to make lower volumes actually quieter
      audioRef.current.volume = applyVolumeCurve(musicSettings.volume);
      audioRef.current.preload = "auto";
      
      // Set loop behavior based on endTime
      // If endTime is set, we'll handle looping manually
      audioRef.current.loop = !musicSettings.endTime || musicSettings.endTime === 0;
      
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

      // Try to play after user interaction
      const tryPlay = () => {
        if (audioRef.current && !hasAttemptedPlay.current) {
          hasAttemptedPlay.current = true;
          
          // Set start time if specified
          if (startTimeRef.current > 0) {
            audioRef.current.currentTime = startTimeRef.current;
          }
          
          audioRef.current.play().catch((error) => {
            console.error("Error playing background music:", error);
          });
          
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
        }
      };

      // Try autoplay immediately (may fail due to browser policy)
      if (startTimeRef.current > 0) {
        audioRef.current.currentTime = startTimeRef.current;
      }
      audioRef.current.play().then(() => {
        // Autoplay succeeded, set up duration timer if needed
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
        hasAttemptedPlay.current = true;
      }).catch(() => {
        // Autoplay blocked, will play on user interaction
        console.log("Autoplay blocked, waiting for user interaction");
      });

      // Also try on any user interaction
      const events = ["click", "touchstart", "keydown"];
      events.forEach((event) => {
        document.addEventListener(event, tryPlay, { once: true });
      });
    } else {
      // Update source if URL changed
      const currentUrl = audioRef.current.src;
      const newUrl = musicSettings.url;
      
      if (currentUrl !== newUrl) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.pause();
        audioRef.current.src = newUrl;
        audioRef.current.load();
        hasAttemptedPlay.current = false;
        
        // Clear any existing duration timer
        if (durationTimerRef.current) {
          clearTimeout(durationTimerRef.current);
          durationTimerRef.current = null;
        }
        
        // Update loop behavior
        audioRef.current.loop = !musicSettings.endTime || musicSettings.endTime === 0;
        
        // Try to resume playing if it was playing before
        if (wasPlaying) {
          if (startTimeRef.current > 0) {
            audioRef.current.currentTime = startTimeRef.current;
          }
          audioRef.current.play().catch((error) => {
            console.error("Error playing new music:", error);
          });
          
          // Set up duration timer if specified
          if (durationRef.current > 0) {
            durationTimerRef.current = window.setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                hasAttemptedPlay.current = false;
              }
              durationTimerRef.current = null;
            }, durationRef.current * 1000);
          }
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

