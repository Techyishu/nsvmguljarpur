import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Slide {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}

const slides: Slide[] = [
  {
    image: "/images/today-1.jpg",
    eyebrow: "Inspiring Excellence",
    title: "Nurturing Confident, Compassionate Learners",
    description:
      "From Nursery to Class XII, we deliver a balanced education that blends values, academics, and enrichment programmes.",
  },
  {
    image: "/images/s7.jpg",
    eyebrow: "Annual Day Celebration",
    title: "Where Talents Shine & Dreams Take Flight",
    description:
      "Our students showcase their creativity and skills through vibrant performances and cultural celebrations.",
  },
  {
    image: "/images/s6.jpg",
    eyebrow: "Leadership for Tomorrow",
    title: "Building Tomorrow's Leaders Today",
    description:
      "Our mentors shape students into compassionate leaders ready to make a difference in the global society.",
  },
  {
    image: "/images/s4.jpg",
    eyebrow: "Annual Celebrations",
    title: "Celebrating Unity, Diversity & Patriotism",
    description:
      "We foster values of citizenship and national pride through meaningful cultural programmes and celebrations.",
  },
  {
    image: "/images/s3.jpg",
    eyebrow: "Innovation & Learning",
    title: "Encouraging Creativity & Scientific Thinking",
    description:
      "Our students engage in hands-on learning and innovative projects that spark curiosity and problem-solving skills.",
  },
  {
    image: "/images/s2.jpg",
    eyebrow: "Academic Excellence",
    title: "State-of-the-Art Learning Facilities",
    description:
      "Modern laboratories and learning spaces equipped to provide the best educational experience for our students.",
  },
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[420px] md:h-[620px] lg:h-[680px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
          aria-hidden={index !== current}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
      ))}

      <div className="absolute inset-0 z-30">
        <div className="container mx-auto h-full px-4">
          <div className="flex h-full flex-col justify-center max-w-xl md:max-w-2xl">
            <span className="text-[0.65rem] md:text-sm uppercase tracking-[0.3em] text-secondary drop-shadow-lg md:tracking-[0.4em]">
              {slides[current].eyebrow}
            </span>
            <h1 className="mt-3 text-2xl md:mt-4 md:text-5xl lg:text-6xl font-semibold leading-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              {slides[current].title}
            </h1>
            <p className="mt-3 text-xs md:mt-4 md:text-lg text-white leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              {slides[current].description}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 md:mt-8 md:gap-3">
              <Button
                asChild
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-5 py-4 text-xs font-semibold uppercase tracking-wide md:px-6 md:py-5 md:text-sm"
              >
                <Link to="/about">Discover Our School</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/70 text-white hover:bg-white hover:text-primary px-5 py-4 text-xs font-semibold uppercase tracking-wide md:px-6 md:py-5 md:text-sm"
              >
                <Link to="/contact">Plan a Visit</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 h-9 w-9 rounded-full border border-white/50 md:left-4 md:h-11 md:w-11"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20 h-9 w-9 rounded-full border border-white/50 md:right-4 md:h-11 md:w-11"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
      </Button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-1.5 md:bottom-8 md:gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            className={`h-1.5 w-6 rounded-full transition-all md:h-2 md:w-8 ${
              index === current ? "bg-secondary" : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
