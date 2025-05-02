
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

type HeroSectionProps = {
  heroImages: string[];
};

const HeroSection = ({ heroImages }: HeroSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative overflow-hidden bg-indian-blue text-white min-h-[600px]">
      {/* Festoon decorations */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <div className="festoon-container flex justify-between">
          {Array.from({ length: 15 }).map((_, index) => (
            <div
              key={index}
              className="festoon transform-gpu"
              style={{
                animationDelay: `${index * 0.2}s`,
                backgroundColor: index % 3 === 0 ? '#FF9933' : index % 3 === 1 ? '#FFFFFF' : '#138808',
              }}
            />
          ))}
        </div>
      </div>

      {/* Background images with fade transition */}
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out 
              ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          >
            <div
              className="h-full w-full bg-cover bg-center bg-no-repeat transform-gpu scale-105 transition-transform duration-10000"
              style={{
                backgroundImage: `url(${image})`,
                transform: index === activeIndex ? "scale(1.05)" : "scale(1)",
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Overlay with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-indian-blue/90 animate-gradient-shift"></div>

      {/* Content */}
      <div className="container relative z-10 flex h-[600px] flex-col items-center justify-center text-center px-4">
        <h1 className="font-sanskrit text-4xl md:text-5xl lg:text-6xl font-bold mb-8 max-w-3xl animate-text-reveal">
          Unlock Your Potential with <span className="text-indian-saffron animate-color-pulse">Vidya</span>{" "}
          <span className="text-white animate-text-shimmer">Katha</span>
        </h1>
        <p className="max-w-2xl text-lg mb-10 animate-fade-in opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
          Traditional wisdom meets modern education. Learn from expert teachers in a personalized environment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in opacity-0" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
          <Link to="/courses">
            <Button
              size="lg"
              className="bg-indian-saffron hover:bg-indian-saffron/90 text-white transition-transform hover:scale-105 shadow-glow-saffron"
            >
              Explore Courses
            </Button>
          </Link>
          <Link to="/signup">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 transition-transform hover:scale-105"
            >
              Join as Student/Teacher
            </Button>
          </Link>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-scroll-indicator"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
