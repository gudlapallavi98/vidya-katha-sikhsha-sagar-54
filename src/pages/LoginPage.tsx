
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password reset states
  const [resetEmail, setResetEmail] = useState("");
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetPasswordStep, setResetPasswordStep] = useState<"email" | "otp" | "newPassword">("email");
  const [resetOtp, setResetOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

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

  const handleSendResetOtp = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setResetLoading(true);
    
    try {
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          type: "password-reset"
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      
      // In a real app, don't send OTP back, validate server-side
      // For demo purposes we're getting the OTP from the response
      setSentOtp(data.otp);

      toast({
        title: "OTP Sent",
        description: "We've sent a verification code to your email",
      });
      
      setResetPasswordStep("otp");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset code",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (resetOtp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code",
      });
      return;
    }

    // In a real app, validate OTP server-side
    // For demo purposes we're checking against the OTP we got from the server
    if (resetOtp !== sentOtp) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again",
      });
      return;
    }

    setResetPasswordStep("newPassword");
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Do Not Match",
        description: "Please ensure both passwords match",
      });
      return;
    }

    setResetLoading(true);

    try {
      // Update password using Supabase Auth API
      const { error } = await supabase.auth.updateUser({
        email: resetEmail,
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. Please log in with your new password.",
      });

      // Reset all states and close dialog
      setResetPasswordOpen(false);
      setResetPasswordStep("email");
      setResetEmail("");
      setResetOtp("");
      setSentOtp("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Set the email field for login
      setEmail(resetEmail);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <div className="flex flex-col items-center mb-8">
        <GraduationCap className="h-12 w-12 text-indian-saffron mb-4" />
        <h1 className="font-sanskrit text-3xl font-bold text-center">
          <span className="text-indian-saffron">e</span><span className="text-indian-blue">tutorss</span>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs text-indian-blue"
                    type="button"
                    onClick={() => setResetPasswordOpen(true)}
                  >
                    Forgot password?
                  </Button>
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

      {/* Password Reset Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {resetPasswordStep === "email" && "Enter your email to receive a verification code."}
              {resetPasswordStep === "otp" && `Enter the verification code sent to ${resetEmail}.`}
              {resetPasswordStep === "newPassword" && "Create your new password."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {resetPasswordStep === "email" && (
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <Button 
                  className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
                  onClick={handleSendResetOtp}
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            )}
            
            {resetPasswordStep === "otp" && (
              <>
                <div className="flex justify-center py-4">
                  <InputOTP maxLength={6} value={resetOtp} onChange={(value) => setResetOtp(value)}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
                    onClick={handleVerifyOtp}
                  >
                    Verify Code
                  </Button>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setResetPasswordStep("email")}
                    >
                      Back
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="link" 
                      size="sm"
                      onClick={handleSendResetOtp}
                      disabled={resetLoading}
                    >
                      {resetLoading ? "Sending..." : "Resend Code"}
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {resetPasswordStep === "newPassword" && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="w-full"
                    onClick={() => setResetPasswordStep("otp")}
                  >
                    Back
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
