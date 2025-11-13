import { useState, useEffect } from "react";
import { GraduationCap, Loader2 } from "lucide-react";

interface WelcomeScreenProps {
  onEnter: () => void;
  isAudioReady: boolean;
}

export const WelcomeScreen = ({ onEnter, isAudioReady }: WelcomeScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleEnter = () => {
    if (!isAudioReady) {
      console.log('⏳ Audio not ready yet, waiting...');
      return;
    }
    
    console.log('✅ Audio ready, entering...');
    
    // Call onEnter immediately (not after fade) to unmute audio
    onEnter();
    
    // Then start fade animation
    setFadeOut(true);
  };

  // Prevent body scroll while welcome screen is visible
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80 backdrop-blur-sm transition-opacity duration-600 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div
        className={`relative w-full max-w-md mx-auto px-4 transition-all duration-500 ${
          fadeOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Welcome Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10 text-center mt-12 md:mt-20">
          {/* School Name */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg leading-tight">
            Anupam Shiksha Niketan
          </h1>

          {/* Welcome Message */}
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-2 md:mb-3">
            नमस्ते! Welcome to our
          </p>
          <p className="text-secondary text-lg sm:text-xl md:text-2xl font-semibold mb-6 md:mb-10 drop-shadow-md">
            Digital Campus Portal
          </p>

          {/* Enter Button */}
          <button
            onClick={handleEnter}
            disabled={!isAudioReady}
            className={`group relative w-full px-6 py-3.5 sm:px-8 sm:py-4 md:px-10 md:py-5 rounded-xl md:rounded-2xl font-bold text-base sm:text-lg md:text-xl transition-all duration-300 shadow-lg ${
              isAudioReady
                ? 'bg-gradient-to-r from-secondary via-secondary/90 to-secondary/80 hover:from-secondary/90 hover:via-secondary hover:to-secondary text-primary hover:shadow-2xl hover:scale-[1.02] active:scale-95 cursor-pointer'
                : 'bg-white/20 text-white/40 cursor-not-allowed backdrop-blur-sm'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2 md:gap-3">
              {!isAudioReady ? (
                <>
                  <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                  <span className="text-sm sm:text-base md:text-lg">Preparing...</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                  Enter Campus
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-xl md:text-2xl">→</span>
                </>
              )}
            </span>
            {isAudioReady && (
              <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>

          {/* Decorative Elements */}
          <div className="mt-6 md:mt-8 flex justify-center items-center gap-2 md:gap-3">
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-white/30"></div>
            <div className="flex gap-1.5 md:gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary/60 animate-pulse"></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary/80 animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-secondary/60 animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          {/* Tagline */}
          <p className="mt-4 md:mt-6 text-white/60 text-xs sm:text-sm italic">
            Building Futures, Shaping Dreams
          </p>
        </div>
      </div>
    </div>
  );
};

