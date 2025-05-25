
import { Link } from "react-router-dom";
import { CardFooter } from "@/components/ui/card";
import LoginHeader from "@/components/auth/login/LoginHeader";
import LoginOptions from "@/components/auth/login/LoginOptions";
import { Toaster } from "@/components/ui/toaster";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles with different sizes and animations */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full animate-bounce opacity-60"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-r from-indigo-200 to-blue-200 rounded-full animate-bounce opacity-40" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full animate-pulse opacity-70" style={{animationDelay: '1.5s'}}></div>
        
        {/* Enhanced geometric shapes */}
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-to-r from-yellow-200 to-orange-200 rotate-45 animate-spin opacity-30" style={{animationDuration: '8s'}}></div>
        <div className="absolute top-20 right-1/3 w-20 h-20 bg-gradient-to-r from-green-200 to-teal-200 rotate-12 animate-pulse opacity-40"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/6 left-1/3 w-12 h-12 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-lg animate-bounce opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/6 right-1/5 w-14 h-14 bg-gradient-to-r from-violet-200 to-purple-200 rounded-full animate-pulse opacity-60" style={{animationDelay: '2.5s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-blue-300 rounded-full animate-ping opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-purple-300 rounded-full animate-ping opacity-50" style={{animationDelay: '0.7s'}}></div>
        <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-indigo-300 rounded-full animate-ping opacity-70" style={{animationDelay: '1.2s'}}></div>
        
        {/* Moving gradient blobs */}
        <div className="absolute top-1/4 left-1/6 w-36 h-36 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-xl animate-pulse opacity-30" style={{animationDuration: '4s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-44 h-44 bg-gradient-to-r from-indigo-100 to-pink-100 rounded-full blur-xl animate-pulse opacity-25" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>

      <div className="container max-w-md py-12 relative z-10">
        <LoginHeader />
        <LoginOptions />
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground text-center w-full">
            Don't have an account? <Link to="/signup" className="text-indian-blue hover:underline font-medium">Sign Up</Link>
          </p>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default LoginPage;
