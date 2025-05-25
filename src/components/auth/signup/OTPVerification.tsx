
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface OTPVerificationProps {
  email: string;
  name: string;
  onVerify: (otp: string, serverOtp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ 
  email, 
  name,
  onVerify,
  onResend,
  isLoading
}) => {
  const [otp, setOtp] = useState("");
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

    try {
      await onVerify(otp, "");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Invalid verification code",
      });
    }
  };

  const handleResendOTP = async () => {
    try {
      await onResend();
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        variant: "destructive",
        title: "Failed to Resend",
        description: "Please try again",
      });
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
      </div>
    </div>
  );
};

export default OTPVerification;
