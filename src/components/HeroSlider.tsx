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
    <section className="relative bg-gradient-to-br from-primary/5 via-white to-primary/10 overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="max-w-xl lg:max-w-none">
            <span className="text-[0.65rem] md:text-xs uppercase tracking-[0.25em] text-primary md:tracking-[0.35em]">
              {slides[current].eyebrow}
            </span>
            <h1 className="mt-4 text-2xl md:text-4xl lg:text-5xl font-semibold leading-tight text-primary">
              {slides[current].title}
            </h1>
            <p className="mt-4 text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
              {slides[current].description}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 md:mt-8 md:gap-3">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-4 text-xs font-semibold uppercase tracking-wide md:px-6 md:py-5 md:text-sm"
              >
                <Link to="/about">Discover Our School</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 px-5 py-4 text-xs font-semibold uppercase tracking-wide md:px-6 md:py-5 md:text-sm"
              >
                <Link to="/contact">Plan a Visit</Link>
              </Button>
            </div>

            {/* Dot Indicators */}
            <div className="mt-8 flex gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  className={`h-2 w-8 rounded-full transition-all ${
                    index === current ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"
                  }`}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side - Image Slider */}
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
            {slides.map((slide, index) => (
              <div
                key={slide.title}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  index === current ? "opacity-100 z-20" : "opacity-0 z-10"
                }`}
                aria-hidden={index !== current}
              >
                <div className="relative h-full w-full rounded-3xl overflow-hidden border border-border shadow-2xl">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 text-primary hover:bg-white h-9 w-9 rounded-full shadow-lg md:h-11 md:w-11"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-white/90 text-primary hover:bg-white h-9 w-9 rounded-full shadow-lg md:h-11 md:w-11"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
