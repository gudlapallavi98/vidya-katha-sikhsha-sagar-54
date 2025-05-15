
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { sendPasswordResetEmail } from "../api/emailVerification";

export const useNewPasswordStep = (
  newPassword: string,
  confirmPassword: string,
  resetEmail: string,
  setNewPassword: (password: string) => void,
  setConfirmPassword: (password: string) => void,
  onSuccess: () => void,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };
  
  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
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
      
      onSuccess();
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    handleNewPasswordChange,
    handleConfirmPasswordChange,
    handleSubmitNewPassword,
  };
};
