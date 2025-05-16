
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import ForgotPasswordForm from "@/components/auth/forgot-password/ForgotPasswordForm";

const ForgotPasswordPage = () => {
  // Check if the URL has the access_token query parameter, which indicates
  // the user has clicked on the reset password link in their email
  const hasAccessToken = window.location.hash.includes('access_token');
  
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indian-blue">etutorss</h1>
          <p className="text-muted-foreground">Your Learning Partner</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{hasAccessToken ? "Set New Password" : "Reset Password"}</CardTitle>
            <CardDescription>
              {hasAccessToken 
                ? "Enter your new password below" 
                : "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              Remember your password? <Link to="/login" className="text-indian-blue hover:underline">Login</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <Toaster />
    </div>
  );
};

export default ForgotPasswordPage;
