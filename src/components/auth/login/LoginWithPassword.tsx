
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoginWithPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaValue] = useState({
    num1: Math.floor(Math.random() * 10),
    num2: Math.floor(Math.random() * 10)
  });
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate captcha
    const expectedAnswer = (captchaValue.num1 + captchaValue.num2).toString();
    if (captchaAnswer !== expectedAnswer) {
      toast({
        variant: "destructive",
        title: "Invalid captcha",
        description: "Please solve the math problem correctly",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await signIn(email, password);
      
      // Get user role to redirect to appropriate dashboard
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .single();
      
      if (userProfile?.role === 'student') {
        navigate('/student-dashboard');
      } else if (userProfile?.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
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
          <Label htmlFor="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 p-4 rounded-md bg-muted">
          <Label htmlFor="captcha" className="flex items-center gap-2">
            Verify you're human: What is {captchaValue.num1} + {captchaValue.num2}?
          </Label>
          <Input
            id="captcha"
            type="text"
            placeholder="Enter the answer"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            required
          />
        </div>
      </div>

      <Button className="w-full mt-6 bg-indian-saffron hover:bg-indian-saffron/90" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
};

export default LoginWithPassword;
