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

interface BackgroundMusicProps {
  userHasEntered: boolean;
  onAudioReady?: () => void;
}

export const BackgroundMusic = ({ userHasEntered, onAudioReady }: BackgroundMusicProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef(false);
  const hasNotifiedReady = useRef(false);
  const durationTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const endTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);
  const retryTimeoutRef = useRef<number | null>(null);

  const { data: musicSettings } = useQuery({
    queryKey: ["backgroundMusicSettings"],
    queryFn: fetchBackgroundMusicSettings,
    refetchInterval: 30000, // Refetch every 30 seconds to check for updates
  });


  // Effect to unmute audio when user enters via welcome screen
  useEffect(() => {
    if (!userHasEntered || !audioRef.current) {
      return;
    }

    const audio = audioRef.current;
    
    console.log('🔓 User clicked Enter Campus');
    console.log('📊 Before unmute:', {
      muted: audio.muted,
      paused: audio.paused,
      volume: audio.volume,
      currentTime: audio.currentTime,
      readyState: audio.readyState
    });
    
    // Set to start time if needed
    if (startTimeRef.current > 0 && audio.currentTime < startTimeRef.current) {
      audio.currentTime = startTimeRef.current;
    }
    
    // UNMUTE the audio
    audio.muted = false;
    
    console.log('🔊 AUDIO UNMUTED!');
    console.log('📊 After unmute:', {
      muted: audio.muted,
      paused: audio.paused,
      volume: audio.volume,
      currentTime: audio.currentTime
    });
    
    // If audio isn't playing, start it
    if (audio.paused) {
      console.log('⏯️ Audio was paused, starting playback...');
      audio.play()
        .then(() => {
          console.log('✅ Audio now playing UNMUTED at volume:', audio.volume);
        })
        .catch((error) => {
          console.error('❌ Failed to start audio:', error);
        });
    } else {
      console.log('✅ Audio is playing UNMUTED at volume:', audio.volume);
      
      // Verify it stays unmuted
      setTimeout(() => {
        if (audio.muted) {
          console.warn('⚠️ Audio was re-muted! Unmuting again...');
          audio.muted = false;
        }
        console.log('🔍 Final check:', {
          muted: audio.muted,
          paused: audio.paused,
          volume: audio.volume,
          currentTime: audio.currentTime
        });
      }, 200);
    }
    
    // Set up duration timer if specified
    if (durationRef.current > 0 && audioRef.current && !audioRef.current.paused) {
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
  }, [userHasEntered]);

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
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      retryCountRef.current = 0;
      return;
    }

    // Create or update audio element
    if (!audioRef.current) {
      // Create audio using Audio constructor with URL from Supabase
      const audio = new Audio(musicSettings.url);
      
      // Start muted FIRST for autoplay to work (browsers allow muted autoplay)
      audio.muted = true;
      
      // Configure audio properties
      audio.volume = applyVolumeCurve(musicSettings.volume);
      audio.preload = "auto";
      
      // Set loop behavior based on endTime configuration
      audio.loop = !musicSettings.endTime || musicSettings.endTime === 0;
      
      // Mobile-specific attributes (important for iOS and Android)
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.crossOrigin = 'anonymous';
      
      // Add error handler with retry logic for network errors
      audio.addEventListener('error', () => {
        const error = audio.error;
        if (error) {
          // Error codes: 1=ABORTED, 2=NETWORK, 3=DECODE, 4=SRC_NOT_SUPPORTED
          if (error.code === 2 && retryCountRef.current < 3) {
            // Network error - retry with exponential backoff
            const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // 1s, 2s, 4s
            retryCountRef.current++;
            
            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
            }
            
            retryTimeoutRef.current = window.setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.load();
                hasAttemptedPlay.current = false;
              }
              retryTimeoutRef.current = null;
            }, retryDelay);
          } else if (error.code !== 1) {
            // Log other errors (not abort)
            console.error('Background music error:', error.code);
            retryCountRef.current = 0; // Reset retry count
          }
        }
      });
      
      // Reset retry count on successful load
      audio.addEventListener('loadeddata', () => {
        retryCountRef.current = 0;
      });
      
      
      
      // Log when audio can start playing and attempt autoplay
      audio.addEventListener('canplay', () => {
        // Notify parent that audio is ready (only once)
        if (onAudioReady && !hasNotifiedReady.current && audio.readyState >= 3) {
          hasNotifiedReady.current = true;
          onAudioReady();
        }
        
        // Attempt autoplay when ready (only once)
        if (audio.paused && !hasAttemptedPlay.current) {
          // Set start time BEFORE playing
          if (startTimeRef.current > 0) {
            audio.currentTime = startTimeRef.current;
          }
          
          audio.play()
            .then(() => {
              hasAttemptedPlay.current = true;
              console.log('✅ Audio started muted at time:', audio.currentTime);
            })
            .catch(() => {
              hasAttemptedPlay.current = false;
            });
        }
      });
      
      // Also notify on canplaythrough (fully loaded) - only once
      audio.addEventListener('canplaythrough', () => {
        if (onAudioReady && !hasNotifiedReady.current) {
          hasNotifiedReady.current = true;
          onAudioReady();
        }
      });
      
      // Store audio reference
      audioRef.current = audio;
      
      // Try immediate play if audio is ready (might work if cached)
      if (audio.readyState >= 3) {
        // Set start time FIRST
        if (startTimeRef.current > 0) {
          audio.currentTime = startTimeRef.current;
        }
        
        audio.play()
          .then(() => {
            hasAttemptedPlay.current = true;
            console.log('✅ Immediate autoplay started muted at time:', audio.currentTime);
            // If audio is already loaded enough, notify parent (only once)
            if (onAudioReady && !hasNotifiedReady.current) {
              hasNotifiedReady.current = true;
              onAudioReady();
            }
          })
          .catch(() => {
            // Will try again in canplay event
          });
      }
      
      // Audio will start muted and will be unmuted when user clicks "Enter Classroom" button

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
        // Stop current playback
        audioRef.current.pause();
        
        // Update URL and reset to muted state (will be unmuted when user has entered)
        audioRef.current.src = newUrl;
        audioRef.current.muted = !userHasEntered; // Keep unmuted if user already entered
        
        // Reset flags and counters
        hasAttemptedPlay.current = false;
        retryCountRef.current = 0;
        
        // Clear timers
        if (durationTimerRef.current) {
          clearTimeout(durationTimerRef.current);
          durationTimerRef.current = null;
        }
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
        
        // Update loop behavior
        audioRef.current.loop = !musicSettings.endTime || musicSettings.endTime === 0;
        
        // Load and play new audio
        audioRef.current.load();
        audioRef.current.play().catch(() => {
          hasAttemptedPlay.current = false;
        });
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
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []);

  // This component doesn't render anything - music plays in background
  return null;
};

