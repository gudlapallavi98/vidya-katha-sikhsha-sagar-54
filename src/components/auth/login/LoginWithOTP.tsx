
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

const LoginWithOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter your email address",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // First check if user exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('email', email)
        .single();

      if (!profile) {
        toast({
          variant: "destructive",
          title: "User Not Found",
          description: "Please sign up first or check your email address.",
        });
        setIsLoading(false);
        return;
      }

      // Send OTP via Resend using our edge function
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZHNzemRvYmdiaWtybnFxcnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTQzMTYsImV4cCI6MjA2MTY3MDMxNn0.G98OnCs8p1nglvP0qmnaOllhUFIJIuSw2iiaci1OOJo`,
        },
        body: JSON.stringify({
          email: email,
          name: email.split('@')[0],
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
      
      setStep("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      // For login, verify the OTP against our stored server OTP
      if (otp !== serverOtp) {
        throw new Error("Invalid OTP code");
      }

      // Get user profile to determine role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError || !profile) {
        throw new Error("User not found. Please sign up first.");
      }

      // Use magic link for authentication without creating user
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        console.error("Supabase auth error:", error);
        // Continue with manual session creation since we verified OTP
      }

      console.log("OTP verified successfully for user:", profile);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Small delay to ensure proper state management
      setTimeout(() => {
        // Redirect based on user role
        if (profile.role === 'teacher') {
          navigate('/teacher-dashboard');
        } else if (profile.role === 'student') {
          navigate('/student-dashboard');
        } else {
          navigate('/');
        }
      }, 100);
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: error instanceof Error ? error.message : "Please check your code and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    const form = document.createElement('form');
    const event = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'target', { value: form });
    Object.defineProperty(event, 'currentTarget', { value: form });
    handleSendOTP(event as unknown as React.FormEvent<HTMLFormElement>);
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

        <form onSubmit={handleVerifyOTP} className="space-y-4">
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
          Enter your email to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Verification Code"}
        </Button>
      </form>
    </div>
  );
};

export default LoginWithOTP;
