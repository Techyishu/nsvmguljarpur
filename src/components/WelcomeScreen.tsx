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
    setFadeOut(true);
    // Wait for fade animation to complete before calling onEnter
    setTimeout(() => {
      onEnter();
    }, 600);
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
        className={`relative max-w-lg mx-4 transition-all duration-500 ${
          fadeOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Welcome Panel */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 text-center mt-16 md:mt-20">
          {/* School Name */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Anupam Shiksha Niketan
          </h1>

          {/* Welcome Message */}
          <p className="text-white/90 text-xl mb-3">
            नमस्ते! Welcome to our
          </p>
          <p className="text-secondary text-2xl font-semibold mb-10 drop-shadow-md">
            Digital Campus Portal
          </p>

          {/* Enter Button */}
          <button
            onClick={handleEnter}
            disabled={!isAudioReady}
            className={`group relative w-full px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg ${
              isAudioReady
                ? 'bg-gradient-to-r from-secondary via-secondary/90 to-secondary/80 hover:from-secondary/90 hover:via-secondary hover:to-secondary text-primary hover:shadow-2xl hover:scale-[1.02] active:scale-95 cursor-pointer'
                : 'bg-white/20 text-white/40 cursor-not-allowed backdrop-blur-sm'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {!isAudioReady ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Preparing Experience...
                </>
              ) : (
                <>
                  <GraduationCap className="w-6 h-6" />
                  Enter Campus
                  <span className="group-hover:translate-x-1 transition-transform duration-300 text-2xl">→</span>
                </>
              )}
            </span>
            {isAudioReady && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            )}
          </button>

          {/* Decorative Elements */}
          <div className="mt-8 flex justify-center items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30"></div>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-secondary/80 animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse" style={{ animationDelay: '300ms' }}></div>
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          {/* Tagline */}
          <p className="mt-6 text-white/60 text-sm italic">
            Building Futures, Shaping Dreams
          </p>
        </div>
      </div>
    </div>
  );
};

