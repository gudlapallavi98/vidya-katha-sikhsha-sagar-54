
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const handleStartLearning = () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    // Route to appropriate dashboard based on user role
    if (profile?.role === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (profile?.role === 'student') {
      navigate('/student-dashboard');
    } else {
      // Default to student dashboard if role is not clear
      navigate('/student-dashboard');
    }
  };

  const handleWatchDemo = () => {
    // Placeholder for demo video functionality
    console.log("Watch demo clicked");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50 py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23f97316" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-sanskrit text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Master Your{" "}
                <span className="bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
                  Learning Journey
                </span>
              </h1>
              <p className="text-lg text-gray-600 sm:text-xl">
                Connect with expert tutors and unlock your potential through personalized 
                one-on-one sessions. Learn at your own pace with India's most trusted 
                educational platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button 
                onClick={handleStartLearning}
                size="lg" 
                className="group bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:scale-105"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button 
                onClick={handleWatchDemo}
                variant="outline" 
                size="lg" 
                className="group border-2 border-green-600 px-8 py-4 text-lg font-semibold text-green-600 transition-all hover:bg-green-50 hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 sm:text-3xl">10K+</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 sm:text-3xl">500+</div>
                <div className="text-sm text-gray-600">Expert Tutors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 sm:text-3xl">50+</div>
                <div className="text-sm text-gray-600">Subjects</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg">
              {/* Main Card */}
              <div className="relative z-10 rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-green-600"></div>
                  <div>
                    <div className="font-semibold text-gray-900">Live Session</div>
                    <div className="text-sm text-gray-600">Mathematics - Algebra</div>
                  </div>
                </div>
                <div className="mb-4 h-32 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100"></div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Join Class Now
                </Button>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-4 -top-4 z-20 rounded-lg bg-orange-500 p-3 text-white shadow-lg animate-float">
                <div className="text-xs font-semibold">98% Success Rate</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 z-20 rounded-lg bg-green-600 p-3 text-white shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="text-xs font-semibold">24/7 Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
