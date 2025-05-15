
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ResetStep } from "../types";

export const useEmailStep = (
  resetEmail: string,
  setResetPasswordStep: (step: ResetStep) => void,
  setSentOtp: (otp: string) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendResetOtp = async () => {
    if (!resetEmail || !resetEmail.includes('@')) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Since we're removing email verification, we'll just move to OTP step
      // and mock the OTP functionality
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(mockOtp);
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
      
      // Move to OTP verification step
      setResetPasswordStep("otp");
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSendResetOtp
  };
};
