
import { useState } from "react";
import SignUpForm from "@/components/auth/signup/SignUpForm";
import SignUpHeader from "@/components/auth/signup/SignUpHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  const [captchaValue] = useState({
    num1: Math.floor(Math.random() * 10),
    num2: Math.floor(Math.random() * 10)
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles with different sizes and animations */}
        <div className="absolute top-16 left-16 w-36 h-36 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/3 right-24 w-28 h-28 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-pulse opacity-50" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-1/3 left-1/5 w-44 h-44 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full animate-bounce opacity-40" style={{animationDelay: '0.4s'}}></div>
        <div className="absolute bottom-16 right-16 w-32 h-32 bg-gradient-to-r from-orange-300 to-red-200 rounded-full animate-pulse opacity-70" style={{animationDelay: '1.2s'}}></div>
        
        {/* Enhanced geometric shapes */}
        <div className="absolute top-1/2 left-12 w-20 h-20 bg-gradient-to-r from-red-200 to-pink-200 rotate-45 animate-spin opacity-30" style={{animationDuration: '10s'}}></div>
        <div className="absolute top-24 right-1/4 w-24 h-24 bg-gradient-to-r from-amber-200 to-orange-200 rotate-12 animate-pulse opacity-40"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/5 left-2/5 w-16 h-16 bg-gradient-to-r from-yellow-300 to-amber-300 rounded-lg animate-bounce opacity-45" style={{animationDelay: '1.8s'}}></div>
        <div className="absolute bottom-1/5 right-2/5 w-18 h-18 bg-gradient-to-r from-orange-300 to-red-300 rounded-full animate-pulse opacity-55" style={{animationDelay: '2.2s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/2 w-5 h-5 bg-orange-300 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/3 w-7 h-7 bg-yellow-300 rounded-full animate-ping opacity-50" style={{animationDelay: '0.6s'}}></div>
        <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-amber-300 rounded-full animate-ping opacity-70" style={{animationDelay: '1s'}}></div>
        
        {/* Moving gradient blobs */}
        <div className="absolute top-1/5 right-1/6 w-40 h-40 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full blur-xl animate-pulse opacity-30" style={{animationDuration: '5s'}}></div>
        <div className="absolute bottom-1/4 left-1/6 w-48 h-48 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full blur-xl animate-pulse opacity-25" style={{animationDuration: '7s', animationDelay: '1.5s'}}></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-1/6 right-1/6 w-12 h-2 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-1/6 left-1/6 w-2 h-12 bg-gradient-to-b from-amber-300 to-orange-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '0.8s'}}></div>
        
        {/* Star-like shapes */}
        <div className="absolute top-2/5 right-1/5 w-8 h-8 bg-yellow-400 rotate-45 animate-spin opacity-40" style={{animationDuration: '15s'}}></div>
        <div className="absolute bottom-2/5 left-1/5 w-6 h-6 bg-orange-400 rotate-45 animate-spin opacity-35" style={{animationDuration: '12s', animationDelay: '2s'}}></div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>

      <div className="container max-w-xl py-8 relative z-10">
        <SignUpHeader />

        <Card className="mt-6 backdrop-blur-sm bg-white/90 shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Join Etutorss
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Create an account to get started with personalized learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm captchaValue={captchaValue} />
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Already have an account? <Link to="/login" className="text-indian-blue hover:underline font-medium">Login</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
