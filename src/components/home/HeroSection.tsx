
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type HeroSectionProps = {
  heroImages: string[];
};

const HeroSection = ({ heroImages }: HeroSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Return either the logged-in user hero section or the non-logged in hero section
  return (
    <>
      {user ? (
        // Logged-in user hero section
        <section className="relative overflow-hidden bg-gradient-to-r from-orange-100 to-green-100 text-gray-700 min-h-[600px]">
          <div className="container relative z-10 flex h-[600px] flex-col items-start justify-center px-4">
            <h1 className="font-sanskrit text-5xl md:text-6xl lg:text-7xl font-bold mb-2 max-w-3xl">
              <span className="text-blue-600">Master Your Future</span><br />
              <span className="text-orange-500">the Indian Way!</span>
            </h1>
            <p className="max-w-2xl text-lg mb-10 text-gray-600">
              Join thousands of students achieving academic excellence through personalized learning experiences with India's top educators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/courses">
                <Button
                  size="lg"
                  className="bg-orange-400 hover:bg-orange-500 text-white transition-transform hover:scale-105 shadow-lg px-8 py-6 text-lg"
                >
                  Start Learning Now
                </Button>
              </Link>
              <Link to="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white border-green-600 text-green-600 hover:bg-green-50 transition-transform hover:scale-105 px-8 py-6 text-lg"
                >
                  Explore Courses
                </Button>
              </Link>
            </div>

            <div className="relative w-full max-w-xl">
              <Input 
                type="text" 
                placeholder="Search for subjects, courses, or tutors..." 
                className="pl-10 py-6 pr-16 rounded-full bg-white/90 backdrop-blur-sm border-none text-gray-700 shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                className="absolute right-1 top-1 bottom-1 bg-green-600 hover:bg-green-700 rounded-full px-6"
                onClick={() => console.log("Search for:", searchQuery)}
              >
                Search
              </Button>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            <div className="flex flex-wrap items-center gap-4 md:gap-8 mt-8">
              <div className="flex items-center gap-2 text-orange-600">
                <div className="rounded-full bg-orange-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <span className="text-lg">Live Classes</span>
              </div>
              
              <div className="flex items-center gap-2 text-orange-600">
                <div className="rounded-full bg-orange-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <span className="text-lg">Interactive Sessions</span>
              </div>
              
              <div className="flex items-center gap-2 text-orange-600">
                <div className="rounded-full bg-orange-100 p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <span className="text-lg">Expert Tutors</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Non-logged in hero section
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
              Unlock Your Potential with <span className="text-indian-saffron animate-color-pulse">Etutors</span>
              <span className="text-green-500">s</span>
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
      )}
    </>
  );
};

export default HeroSection;
