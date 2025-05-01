
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Error is handled in signIn function
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <div className="flex flex-col items-center mb-8">
        <GraduationCap className="h-12 w-12 text-indian-saffron mb-4" />
        <h1 className="font-sanskrit text-3xl font-bold text-center">
          <span className="text-indian-saffron">Vidya</span> <span className="text-indian-blue">Katha</span>
        </h1>
        <p className="text-muted-foreground text-center mt-2">
          Sign in to your account
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
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
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button className="w-full mt-6 bg-indian-saffron hover:bg-indian-saffron/90" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Don't have an account? <Link to="/signup" className="text-indian-blue hover:underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
