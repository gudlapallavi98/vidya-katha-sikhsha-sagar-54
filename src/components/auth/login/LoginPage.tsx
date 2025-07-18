
// We need to ensure the LoginPage properly includes the Toaster component
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import LoginHeader from "@/components/auth/login/LoginHeader";
import LoginForm from "@/components/auth/login/LoginForm";
import { Toaster } from "@/components/ui/toaster";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen bg-orange-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full translate-x-1/3 translate-y-1/3 animate-pulse opacity-60 animation-delay-1000"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-orange-300 rounded-full animate-bounce opacity-40 animation-delay-500"></div>
        <div className="absolute bottom-1/4 left-20 w-32 h-32 bg-orange-300 rounded-full animate-bounce opacity-40 animation-delay-1500"></div>
      </div>

      <div className="container max-w-md py-12 relative z-10">
        <LoginHeader />

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Don't have an account? <Link to="/signup" className="text-indian-blue hover:underline">Sign Up</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Make sure toasts are visible on this page */}
      <Toaster />
    </div>
  );
};

export default LoginPage;
