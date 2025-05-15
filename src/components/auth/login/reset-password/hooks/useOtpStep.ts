
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useOtpStep = (
  resetOtp: string,
  sentOtp: string,
  setResetPasswordStep: (step: string) => void,
  handleSendResetOtp: () => Promise<void>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleVerifyOtp = () => {
    if (resetOtp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verify OTP (in production this should be server-side)
      if (resetOtp === sentOtp) {
        // Move to new password step
        setResetPasswordStep("newPassword");
        toast({
          title: "OTP Verified",
          description: "Please set your new password",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: "The code you entered is incorrect",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleVerifyOtp,
    handleResendOtp: handleSendResetOtp
  };
};
