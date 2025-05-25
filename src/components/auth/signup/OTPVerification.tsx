
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  email: string;
  userData: any;
  onSuccess: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  userData, 
  onSuccess, 
  onBack 
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Verifying OTP for email:", email);

      // First verify the OTP from our signup_otps table
      const { data: otpData, error: otpError } = await supabase
        .from('signup_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otp)
        .eq('verified', false)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (otpError || !otpData) {
        throw new Error("Invalid or expired OTP");
      }

      // Mark OTP as verified
      const { error: updateError } = await supabase
        .from('signup_otps')
        .update({ verified: true, used: true })
        .eq('id', otpData.id);

      if (updateError) {
        console.error("Error updating OTP:", updateError);
      }

      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          }
        }
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      console.log("User created successfully:", authData);

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      });

      onSuccess();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid verification code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: `${userData.firstName} ${userData.lastName}`,
          type: "signup"
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to resend OTP");
      }

      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold">Verify Your Email</h3>
        <p className="text-sm text-muted-foreground mt-2">
          We've sent a 6-digit verification code to<br />
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerifyOTP} className="space-y-6">
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
          {isLoading ? "Verifying..." : "Verify & Create Account"}
        </Button>
      </form>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?
        </p>
        <Button 
          variant="link" 
          onClick={handleResendOTP}
          disabled={isLoading}
          className="text-sm"
        >
          Resend Verification Code
        </Button>
        <Button 
          variant="link" 
          onClick={onBack}
          className="text-sm"
        >
          Change Email Address
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
