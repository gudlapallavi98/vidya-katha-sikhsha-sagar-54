import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

const LoginWithOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const sendOTPEmail = async (): Promise<boolean> => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      // Get auth users and check email
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw new Error("Unable to verify user account. Please try again.");
      }

      const matchingUser = authUsers.users.find((user: User) => user.email === email);
      
      if (!matchingUser || !matchingUser.email) {
        throw new Error("No account found with this email. Please register first or use password login.");
      }

      // Get profile data for the matching user
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name, profile_completed')
        .eq('id', matchingUser.id)
        .single();

      if (profileError || !userProfile) {
        throw new Error("User profile not found. Please contact support.");
      }

      console.log("Sending OTP to existing user:", email);
      
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZHNzemRvYmdiaWtybnFxcnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTQzMTYsImV4cCI6MjA2MTY3MDMxNn0.G98OnCs8p1nglvP0qmnaOllhUFIJIuSw2iiaci1OOJo`,
        },
        body: JSON.stringify({
          email: email,
          name: userProfile.first_name || email.split('@')[0],
          type: "login"
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send OTP");
      }

      console.log("OTP sent successfully:", result);
      setServerOtp(result.otp || "");
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
      
      return true;
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: error instanceof Error ? error.message : "Please try again",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    const success = await sendOTPEmail();
    if (success) {
      setStep("otp");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log("Verifying OTP:", otp, "against server OTP:", serverOtp);
      
      if (otp !== serverOtp) {
        throw new Error("Invalid OTP code");
      }

      // Get auth users and find matching user
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw new Error("Unable to verify user account");
      }
      
      const matchingUser = authUsers.users.find((user: User) => user.email === email);
      
      if (!matchingUser || !matchingUser.email) {
        throw new Error("User account not found");
      }

      // Get user profile
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name, profile_completed')
        .eq('id', matchingUser.id)
        .single();

      if (profileError || !userProfile) {
        throw new Error("User profile not found");
      }

      const userRole = userProfile.role;
      const userId = matchingUser.id;

      // Store authentication info in localStorage
      const authData = {
        id: userId,
        email: email,
        loginMethod: 'otp',
        role: userRole,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        profile_completed: userProfile.profile_completed || false
      };
      
      localStorage.setItem('authenticated_user', JSON.stringify(authData));
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Navigate based on role
      setTimeout(() => {
        const targetRoute = userRole === 'teacher' ? '/teacher-dashboard' : '/student-dashboard';
        console.log("Redirecting to:", targetRoute);
        navigate(targetRoute, { replace: true });
        window.location.href = targetRoute;
      }, 100);
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Please check your code and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const success = await sendOTPEmail();
    if (success) {
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    }
  };

  if (step === "otp") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Enter Verification Code</h3>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a 6-digit code to {email}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleVerifyOTP(); }} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP value={otp} onChange={setOtp} maxLength={6}>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Login"}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <Button 
            variant="link" 
            onClick={handleResendOTP}
            disabled={isLoading}
            className="text-sm"
          >
            Resend Code
          </Button>
          <Button 
            variant="link" 
            onClick={() => setStep("email")}
            className="text-sm"
          >
            Change Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Login with OTP</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your email to receive a verification code (for existing users only)
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your registered email"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Checking..." : "Send Verification Code"}
        </Button>
      </form>
    </div>
  );
};

export default LoginWithOTP;
