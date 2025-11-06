import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/images/imgi_136_our-gallery-19.jpg", // School building with students receiving sweets
    title: "ANUPAM SHIKSHA NIKETAN",
    subtitle: "SR. SEC. SCHOOL"
  },
  {
    image: "/images/directors-message.jpg", // Man speaking at decorated podium
    title: "BUILDING TOMORROW",
    subtitle: "EXCELLENCE IN EDUCATION"
  },
  {
    image: "/images/s7.jpg", // Students receiving sweets in front of school
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
    <div className="relative h-[700px] z-0 overflow-visible">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 z-0 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-contain object-center"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center text-center bg-black/30">
            <div className="text-white px-4 max-w-5xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight animate-fade-in drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg lg:text-xl font-semibold tracking-[0.2em] animate-fade-in animation-delay-200 uppercase drop-shadow-lg">
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
