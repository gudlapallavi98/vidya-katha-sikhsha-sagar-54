
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type HeroSectionProps = {
  heroImages: string[];
};

const HeroSection = ({ heroImages }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-indian-blue text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="flex animate-carousel">
          {heroImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div 
                className="h-[500px] w-screen bg-cover bg-center bg-no-repeat"
                style={{backgroundImage: `url(${image})`}}
              ></div>
            </div>
          ))}
          {/* Duplicate images for seamless looping */}
          {heroImages.map((image, index) => (
            <div key={`dup-${index}`} className="w-full flex-shrink-0">
              <div 
                className="h-[500px] w-screen bg-cover bg-center bg-no-repeat"
                style={{backgroundImage: `url(${image})`}}
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container relative z-10 flex h-[500px] flex-col items-center justify-center text-center">
        <h1 className="font-sanskrit text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
          Unlock Your Potential with <span className="text-indian-saffron">Vidya</span> <span className="text-white">Katha</span>
        </h1>
        <p className="max-w-2xl text-lg mb-10">
          Traditional wisdom meets modern education. Learn from expert teachers in a personalized environment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/courses">
            <Button size="lg" className="bg-indian-saffron hover:bg-indian-saffron/90 text-white">
              Explore Courses
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Join as Student/Teacher
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
