
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetEmail } from "../api/emailVerification";

export const useNewPasswordStep = (
  newPassword: string,
  confirmPassword: string,
  resetEmail: string,
  onClose: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Password should be at least 8 characters long",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Send a password reset email through Supabase Auth
      await sendPasswordResetEmail(resetEmail);
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a password reset link",
      });
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: "Please try the forgot password process again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleResetPassword
  };
};
