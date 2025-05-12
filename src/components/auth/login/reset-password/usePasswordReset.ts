
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ResetStep = "email" | "otp" | "newPassword";

export const usePasswordReset = (onClose: () => void) => {
  const [resetEmail, setResetEmail] = useState("");
  const [resetPasswordStep, setResetPasswordStep] = useState<ResetStep>("email");
  const [resetOtp, setResetOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
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

    setResetLoading(true);
    
    try {
      // Use the Supabase Edge Function to send an email with OTP
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          type: "password-reset"
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error("Email sending error:", data);
        throw new Error(data.error || "Failed to send password reset email");
      }
      
      // Use the OTP from the server response
      if (data.otp) {
        setSentOtp(data.otp);
      }
      
      toast({
        title: "Password Reset Code Sent",
        description: "Please check your email for the verification code",
      });
      
      setResetPasswordStep("otp");
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send reset code",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (resetOtp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code",
      });
      return;
    }

    if (resetOtp !== sentOtp) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "The verification code is incorrect. Please try again",
      });
      return;
    }

    setResetPasswordStep("newPassword");
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Do Not Match",
        description: "Please ensure both passwords match",
      });
      return;
    }

    setResetLoading(true);

    try {
      // Create a session with OTP before updating password
      const { data, error } = await supabase.auth.verifyOtp({
        email: resetEmail,
        token: resetOtp,
        type: 'email'
      });

      if (error) {
        console.error("Verify OTP error:", error);
        throw error;
      }

      // Now we have a valid session, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. Please log in with your new password.",
      });

      // Reset all states and close dialog
      onClose();
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return {
    resetEmail,
    setResetEmail,
    resetPasswordStep,
    setResetPasswordStep,
    resetOtp,
    setResetOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    resetLoading,
    handleSendResetOtp,
    handleVerifyOtp,
    handleResetPassword
  };
};
