
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SignUpPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState({ num1: 0, num2: 0 });
  const [userCaptcha, setUserCaptcha] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Define the generateCaptcha function first, before using it
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaValue({ num1, num2 });
  };
  
  // Use useEffect instead of useState to run code on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      role: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error("Please fill in all required fields");
      }
      
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      // Validate captcha
      if (parseInt(userCaptcha) !== captchaValue.num1 + captchaValue.num2) {
        throw new Error("Incorrect captcha answer");
      }
      
      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.name.split(' ')[0],
            last_name: formData.name.split(' ').slice(1).join(' ') || '',
            role: formData.role
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Create profile entry
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              first_name: formData.name.split(' ')[0],
              last_name: formData.name.split(' ').slice(1).join(' ') || '',
              role: formData.role
            }
          ]);
        
        if (profileError) throw profileError;
        
        toast({
          title: "Registration Successful!",
          description: "Welcome to Vidya Katha Online. Please check your email for verification.",
        });
        
        // Redirect based on role
        if (formData.role === "student") {
          navigate("/student-dashboard");
        } else {
          navigate("/teacher-dashboard");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
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
          Join <span className="text-indian-saffron">Vidya</span> <span className="text-indian-blue">Katha</span>
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Create an account to start your learning journey
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aadhar">Aadhar Number (Optional)</Label>
                <Input 
                  id="aadhar"
                  name="aadhar"
                  placeholder="Your Aadhar number"
                  value={formData.aadhar}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">For verification purposes only</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                <Input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>I am a <span className="text-red-500">*</span></Label>
                <RadioGroup 
                  defaultValue="student" 
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 p-4 rounded-md bg-muted">
                <Label htmlFor="captcha">
                  Verify you're human: What is {captchaValue.num1} + {captchaValue.num2}? <span className="text-red-500">*</span>
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
            
            <Button className="w-full mt-6 bg-indian-saffron hover:bg-indian-saffron/90" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
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
