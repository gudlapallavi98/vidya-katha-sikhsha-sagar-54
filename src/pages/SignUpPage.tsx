
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SignUpHeader from "@/components/auth/signup/SignUpHeader";
import SignUpForm from "@/components/auth/signup/SignUpForm";

const SignUpPage = () => {
  const [captchaValue, setCaptchaValue] = useState({ num1: 0, num2: 0 });
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Generate a simple math captcha
  useEffect(() => {
    const generateCaptcha = () => {
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);
      setCaptchaValue({ num1, num2 });
    };
    
    generateCaptcha();
  }, [refreshKey]);
  
  // Function to refresh the CAPTCHA
  const refreshCaptcha = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container max-w-md py-12">
      <SignUpHeader />
      
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm captchaValue={captchaValue} onValidationError={refreshCaptcha} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Already have an account? <Link to="/login" className="text-indian-blue hover:underline">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpPage;
