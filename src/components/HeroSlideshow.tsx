import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import medicalMission from "@/assets/slides/medical-mission.jpg";
import fiesta from "@/assets/slides/fiesta.jpg";
import sports from "@/assets/slides/sports.jpg";
import cleanup from "@/assets/slides/cleanup.jpg";

const slides = [
  { image: medicalMission, title: "Free Medical Mission", subtitle: "Health services for senior citizens and residents" },
  { image: fiesta, title: "Barangay Fiesta 2026", subtitle: "Celebrating our community's culture and unity" },
  { image: sports, title: "Youth Basketball League", subtitle: "Empowering the youth through sports programs" },
  { image: cleanup, title: "Community Clean-Up Drive", subtitle: "Working together for a cleaner barangay" },
];

const HeroSlideshow = () => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-[420px] md:h-[520px] lg:h-[600px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-end pb-16 md:pb-20 text-center px-4">
        <span className="mb-2 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
          Programs & Events
        </span>
        <h2 className="font-heading text-2xl md:text-4xl lg:text-5xl font-black text-primary-foreground drop-shadow-lg">
          {slides[current].title}
        </h2>
        <p className="mt-2 max-w-lg text-sm md:text-base text-primary-foreground/80 drop-shadow">
          {slides[current].subtitle}
        </p>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/30 p-2 text-primary-foreground backdrop-blur transition hover:bg-card/50"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card/30 p-2 text-primary-foreground backdrop-blur transition hover:bg-card/50"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === current ? "w-8 bg-secondary" : "w-2.5 bg-primary-foreground/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlideshow;
