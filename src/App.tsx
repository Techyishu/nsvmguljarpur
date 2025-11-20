import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import Index from "./pages/Index";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Facilities from "./pages/Facilities";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Activities from "./pages/Activities";
import Staff from "./pages/Staff";
import Toppers from "./pages/Toppers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // No persistence - welcome screen shows on every page refresh
  // State resets on each page load
  const [hasEntered, setHasEntered] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const handleEnter = () => {
    console.log('🚪 User entered - starting audio...');
    setHasEntered(true);
  };

  const handleAudioReady = () => {
    console.log('🎵 Audio is ready for playback');
    setIsAudioReady(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!hasEntered && <WelcomeScreen onEnter={handleEnter} isAudioReady={isAudioReady} />}
          <BackgroundMusic userHasEntered={hasEntered} onAudioReady={handleAudioReady} />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/toppers" element={<Toppers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
