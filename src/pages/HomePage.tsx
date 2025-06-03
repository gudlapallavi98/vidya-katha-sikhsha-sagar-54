
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CourseSection from "@/components/home/CourseSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <CourseSection />
      <TestimonialsSection />
      {!user && <CTASection />}
    </div>
  );
};

export default HomePage;
