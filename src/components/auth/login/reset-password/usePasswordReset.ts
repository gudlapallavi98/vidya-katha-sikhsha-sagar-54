
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
  const [otpError, setOtpError] = useState("");
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
    setOtpError("");
    
    try {
      // First check if user exists
      const { data: userData, error: userError } = await supabase.auth.admin
        .getUserByEmail(resetEmail)
        .catch(() => ({ data: null, error: null }));
      
      // If we can't verify user exists (no admin access), just proceed with sending OTP
      if (userError && userError.message !== "AuthApiError: Email not confirmed") {
        console.log("User check bypassed:", userError.message);
      }
      
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

  const handleVerifyOtp = async () => {
    if (resetOtp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code",
      });
      return;
    }

    setResetLoading(true);
    setOtpError("");
    
    try {
      // Check if OTP matches what we sent
      if (resetOtp !== sentOtp) {
        setOtpError("The verification code is incorrect. Please try again.");
        setResetLoading(false);
        toast({
          variant: "destructive",
          title: "Invalid Code",
          description: "The verification code is incorrect. Please try again",
        });
        return;
      }
      
      // Prepare for password reset by verifying OTP with Supabase
      const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
        email: resetEmail, 
        token: resetOtp,
        type: 'recovery'
      });
      
      if (otpError) {
        if (otpError.message.includes("expired")) {
          setOtpError("Verification code has expired. Please request a new one.");
          throw new Error("Verification code has expired. Please request a new one.");
        }
        throw otpError;
      }
      
      // If verification successful, move to new password step
      setResetPasswordStep("newPassword");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    // Check password strength
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;
    
    if (!isLongEnough) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 8 characters long",
      });
      return;
    }
    
    if (!(hasUppercase && hasNumber) && !hasSpecial) {
      toast({
        variant: "destructive",
        title: "Password Too Weak",
        description: "Password must contain at least an uppercase letter and a number, or a special character",
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
      // Update user's password
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
    otpError,
    handleSendResetOtp,
    handleVerifyOtp,
    handleResetPassword
  };
};
