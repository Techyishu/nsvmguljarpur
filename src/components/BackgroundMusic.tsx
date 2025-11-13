import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBackgroundMusicSettings } from "@/services/content";

export const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasAttemptedPlay = useRef(false);

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
        audioRef.current.play().catch((error) => {
          console.error("Error playing background music:", error);
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

  useEffect(() => {
    if (!musicSettings || !musicSettings.url || !musicSettings.enabled) {
      // Clean up if music is disabled or URL is empty
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        hasAttemptedPlay.current = false;
      }
      return;
    }

    // Create or update audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(musicSettings.url);
      audioRef.current.loop = true;
      audioRef.current.volume = musicSettings.volume;
      audioRef.current.preload = "auto";
      
      // Handle audio events
      audioRef.current.addEventListener("error", (e) => {
        console.error("Error loading audio:", e);
      });

      // Try to play after user interaction
      const tryPlay = () => {
        if (audioRef.current && !hasAttemptedPlay.current) {
          hasAttemptedPlay.current = true;
          audioRef.current.play().catch((error) => {
            console.error("Error playing background music:", error);
          });
        }
      };

      // Try autoplay immediately (may fail due to browser policy)
      audioRef.current.play().catch(() => {
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
        
        // Try to resume playing if it was playing before
        if (wasPlaying) {
          audioRef.current.play().catch((error) => {
            console.error("Error playing new music:", error);
          });
        }
      }
      
      // Update volume
      audioRef.current.volume = musicSettings.volume;
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
    };
  }, []);

  // This component doesn't render anything - music plays in background
  return null;
};

