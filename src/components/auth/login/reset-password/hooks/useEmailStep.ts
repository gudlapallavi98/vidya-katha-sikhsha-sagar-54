
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { verifyEmailExists, sendOtpToEmail } from "../api/emailVerification";
import { ResetStep } from "../types";

export const useEmailStep = (
  resetEmail: string,
  setResetEmail: (email: string) => void,
  setCurrentStep: (step: ResetStep) => void,
  setSentOtp: (otp: string) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetEmail(e.target.value);
  };
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      setCurrentStep("otp");
    } catch (error) {
      console.error("Email verification error:", error);
      toast({
        variant: "destructive",
        title: "Failed to Send OTP",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    handleEmailChange,
    handleEmailSubmit,
  };
};
