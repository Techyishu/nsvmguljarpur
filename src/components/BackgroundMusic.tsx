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

  // Log when settings are loaded
  useEffect(() => {
    if (musicSettings) {
      console.log('🎶 Music settings loaded:', {
        enabled: musicSettings.enabled,
        url: musicSettings.url ? 'URL present' : 'No URL',
        volume: musicSettings.volume,
        startTime: musicSettings.startTime,
        endTime: musicSettings.endTime,
        duration: musicSettings.duration
      });
    }
  }, [musicSettings]);

  // Effect to unmute audio when user enters via welcome screen
  useEffect(() => {
    if (userHasEntered && audioRef.current && audioRef.current.muted) {
      console.log('🔓 Welcome screen dismissed - unmuting audio...');
      
      // Unmute the audio (user clicked "Enter Classroom" button = valid user gesture)
      audioRef.current.muted = false;
      console.log('🔊 Audio unmuted! Music should now be audible');
      console.log('📊 Audio state:', {
        volume: audioRef.current.volume,
        currentTime: audioRef.current.currentTime,
        duration: audioRef.current.duration,
        muted: audioRef.current.muted,
        paused: audioRef.current.paused
      });
      
      // If audio isn't playing, try to start it
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          console.log('✅ Audio started playing after welcome screen');
        }).catch((error) => {
          console.warn('❌ Failed to start audio:', error.name);
        });
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
      console.log('🎧 Creating new Audio element with URL:', musicSettings.url);
      
      // Create audio using Audio constructor with URL from Supabase
      const audio = new Audio(musicSettings.url);
      
      // Start muted FIRST for autoplay to work (browsers allow muted autoplay)
      audio.muted = true;
      
      // Configure audio properties
      audio.volume = applyVolumeCurve(musicSettings.volume);
      audio.preload = "auto";
      
      console.log('🔇 Audio created MUTED, volume:', audio.volume);
      
      // Set loop behavior based on endTime configuration
      audio.loop = !musicSettings.endTime || musicSettings.endTime === 0;
      
      // Mobile-specific attributes (important for iOS and Android)
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.crossOrigin = 'anonymous';
      
      console.log('⚙️ Audio configured:', {
        muted: audio.muted,
        volume: audio.volume,
        loop: audio.loop,
        preload: audio.preload
      });
      
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
        console.log('🎵 Audio loaded, attempting muted autoplay...');
      });
      
      // Log when audio actually starts playing
      audio.addEventListener('playing', () => {
        console.log('▶️▶️ Audio is now PLAYING!', {
          muted: audio.muted,
          volume: audio.volume,
          currentTime: audio.currentTime,
          paused: audio.paused,
          readyState: audio.readyState
        });
        
        // CRITICAL CHECK: If audio is playing unmuted, verify user has entered
        if (!audio.muted && !userHasEntered) {
          console.warn('⚠️ Audio is unmuted but user hasn\'t entered yet! Remuting...');
          audio.muted = true;
        }
      });
      
      // Log if audio is paused
      audio.addEventListener('pause', () => {
        console.log('⏸️ Audio paused');
      });
      
      // Log when audio can start playing and attempt autoplay
      audio.addEventListener('canplay', () => {
        console.log('✅ Audio ready to play, state:', {
          paused: audio.paused,
          muted: audio.muted,
          volume: audio.volume,
          readyState: audio.readyState
        });
        
        // Notify parent that audio is ready
        if (onAudioReady && audio.readyState >= 3) {
          onAudioReady();
        }
        
        // Set start time if specified (do this before playing)
        if (startTimeRef.current > 0) {
          audio.currentTime = startTimeRef.current;
          console.log('⏩ Set start time to:', startTimeRef.current);
        }
        
        // Attempt autoplay when ready (only once)
        if (audio.paused && !hasAttemptedPlay.current) {
          console.log('▶️ Starting muted autoplay from canplay event...');
          audio.play()
            .then(() => {
              console.log('✅ Muted autoplay started successfully!');
              hasAttemptedPlay.current = true;
            })
            .catch((error) => {
              console.warn('❌ Muted autoplay failed:', error.name, error.message);
              hasAttemptedPlay.current = false;
            });
        }
      });
      
      // Also notify on canplaythrough (fully loaded)
      audio.addEventListener('canplaythrough', () => {
        console.log('✅ Audio fully loaded (canplaythrough)');
        if (onAudioReady) {
          onAudioReady();
        }
      });
      
      // Store audio reference
      audioRef.current = audio;
      
      // Also try immediate play (might work if cached)
      console.log('▶️ Attempting immediate muted autoplay...');
      audio.play()
        .then(() => {
          console.log('✅ Immediate autoplay started!');
          hasAttemptedPlay.current = true;
          // If audio is already loaded enough, notify parent
          if (onAudioReady && audio.readyState >= 3) {
            onAudioReady();
          }
        })
        .catch(() => {
          // Will try again in canplay event
          console.log('⏳ Immediate play blocked, will retry when ready');
        });
      
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

