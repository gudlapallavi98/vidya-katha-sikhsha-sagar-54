
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CourseSection from "@/components/home/CourseSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  const { user } = useAuth();
  
  const heroImages = [
    "/hero1.jpg",
    "/hero2.jpg",
    "/hero3.jpg",
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <HeroSection heroImages={heroImages} />
      <FeaturesSection />
      <CourseSection />
      <TestimonialsSection />
      {!user && <CTASection />}
    </div>
  );
};

export default Index;
