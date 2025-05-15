
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { verifyEmailExists, sendOtpToEmail } from "../api/emailVerification";

export const useEmailStep = (
  resetEmail: string,
  setResetPasswordStep: (step: string) => void,
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
      // Check if email exists in profiles
      const { exists } = await verifyEmailExists(resetEmail);
      
      // If no profile found with this email
      if (!exists) {
        toast({
          variant: "destructive",
          title: "Email Not Found",
          description: "No account exists with this email address",
        });
        setIsLoading(false);
        return;
      }
      
      // Send OTP to email
      const result = await sendOtpToEmail(resetEmail);
      
      // Save the OTP locally for verification
      setSentOtp(result.otp);
      
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
