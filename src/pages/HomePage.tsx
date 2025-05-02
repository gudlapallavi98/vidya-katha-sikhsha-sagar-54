
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CourseSection from "@/components/home/CourseSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const HomePage = () => {
  const heroImages = [
    "/hero1.jpg",
    "/hero2.jpg",
    "/hero3.jpg",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection heroImages={heroImages} />
      <FeaturesSection />
      <CourseSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
