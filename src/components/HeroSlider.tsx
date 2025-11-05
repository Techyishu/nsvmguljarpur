import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&h=800&fit=crop",
    title: "SHIKSHA NIKETAN",
    subtitle: "EDUCATIONAL INSTITUTION"
  },
  {
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=800&fit=crop",
    title: "BUILDING TOMORROW",
    subtitle: "EXCELLENCE IN EDUCATION"
  },
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=800&fit=crop",
    title: "NURTURING MINDS",
    subtitle: "SHAPING FUTURES"
  }
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[700px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
            <div className="text-white px-4 max-w-5xl">
              <h1 className="text-7xl md:text-9xl font-black mb-6 tracking-tight animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl font-semibold tracking-[0.3em] animate-fade-in animation-delay-200 uppercase">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-white/20 h-12 w-12"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 text-white hover:bg-white/20 h-12 w-12"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-1 transition-all ${
              index === current ? "bg-secondary w-12" : "bg-white/50 w-8"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};
