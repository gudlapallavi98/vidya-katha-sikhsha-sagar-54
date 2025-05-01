
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState({ num1: 0, num2: 0 });
  const [userCaptcha, setUserCaptcha] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Generate captcha values when component mounts
  useState(() => {
    generateCaptcha();
  });

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaValue({ num1, num2 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }
      
      // Validate captcha
      if (parseInt(userCaptcha) !== captchaValue.num1 + captchaValue.num2) {
        throw new Error("Incorrect captcha answer");
      }
      
      // TODO: Will be implemented with Supabase later
      console.log("Login attempted:", { email });
      
      // For now, simulate successful login
      setTimeout(() => {
        // Mock recognition of student vs teacher based on email
        const role = email.includes("teacher") ? "teacher" : "student";
        
        toast({
          title: "Login Successful!",
          description: "Welcome back to Vidya Katha Online.",
        });
        
        // Redirect based on role
        if (role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/student-dashboard");
        }
      }, 1500);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <div className="flex flex-col items-center mb-8">
        <GraduationCap className="h-12 w-12 text-indian-saffron mb-4" />
        <h1 className="font-sanskrit text-3xl font-bold text-center">
          Welcome back to <span className="text-indian-saffron">Vidya</span> <span className="text-indian-blue">Katha</span>
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Please sign in to your account
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-indian-blue hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Input 
                  id="password"
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 p-4 rounded-md bg-muted">
                <Label htmlFor="captcha">
                  Verify you're human: What is {captchaValue.num1} + {captchaValue.num2}?
                </Label>
                <Input 
                  id="captcha"
                  type="text"
                  placeholder="Enter the answer"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <Button className="w-full mt-6 bg-indian-blue hover:bg-indian-blue/90" type="submit" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Don't have an account yet? <Link to="/signup" className="text-indian-saffron hover:underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
