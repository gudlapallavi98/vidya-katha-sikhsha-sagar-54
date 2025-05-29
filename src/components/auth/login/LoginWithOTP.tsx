
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
      // First check if user exists in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      // Check if user exists by email in auth.users (we need to use a different approach)
      const { data: existingUser, error: userError } = await supabase.auth.getUser();
      
      // Let's use our custom send-otp function instead
      const response = await fetch('/functions/v1/send-email/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          email: email,
          name: "User", // We'll use a default name since we can't fetch it easily
          type: "login"
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to send OTP");
      }

      console.log("OTP sent successfully via custom function to:", email);
      
      // Store the OTP for verification (in production, this should be server-side)
      setServerOtp(result.otp);
      
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
      console.log("Verifying OTP:", otp);
      
      // Verify OTP against the server OTP
      if (otp !== serverOtp) {
        throw new Error("Invalid OTP code. Please check your email and try again.");
      }

      // If OTP is correct, sign in the user with email (passwordless)
      const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false // Don't create new users for login
        }
      });

      if (authError) {
        throw new Error("Failed to sign in. Please try again.");
      }

      console.log("OTP verification successful");
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Get user profile to determine redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        // Navigate based on user role
        if (profile?.role === 'teacher') {
          navigate('/teacher-dashboard', { replace: true });
        } else {
          navigate('/student-dashboard', { replace: true });
        }
      } else {
        navigate('/student-dashboard', { replace: true });
      }
      
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
