
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePasswordResetOTP } from "@/hooks/use-password-reset-otp";

export const usePasswordReset = (onClose?: () => void) => {
  // We'll keep the original naming for consistency with PasswordResetForm.tsx
  const [resetPasswordStep, setResetPasswordStep] = useState<"email" | "otp" | "newPassword">("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const { toast } = useToast();
  
  // Use our custom OTP hook
  const { createOTP, verifyOTP, markOTPAsUsed } = usePasswordResetOTP();

  const resetError = () => setError(null);

  const handleSendResetOtp = async () => {
    setResetLoading(true);
    setError(null);
    
    try {
      // Generate and store OTP using our custom hook
      const generatedOTP = await createOTP(resetEmail);
      
      if (!generatedOTP) {
        throw new Error("Failed to initialize password reset. Please try again.");
      }
      
      console.log("Generated OTP:", generatedOTP);
      
      // Call the edge function to send email
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: resetEmail,
          name: "",
          type: "password-reset",
          otp: generatedOTP
        })
      });

      const responseData = await response.json();
      console.log("Edge function response:", responseData);

      if (!response.ok) {
        console.error("Error response:", responseData);
        throw new Error(responseData.error || "Failed to send OTP. Please try again.");
      }
      
      setOtpSent(true);
      setResetPasswordStep("otp");
      
      toast({
        title: "OTP Sent",
        description: "A one-time password has been sent to your email.",
      });
    } catch (err: any) {
      console.error("Failed to send OTP:", err);
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setResetLoading(true);
    setOtpError(null);

    try {
      // Verify OTP using our custom hook
      const isValid = await verifyOTP(resetEmail, resetOtp);

      if (!isValid) {
        throw new Error("Invalid or expired OTP. Please try again.");
      }
      
      setOtpVerified(true);
      setResetPasswordStep("newPassword");
    } catch (err: any) {
      setOtpError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setResetLoading(true);
    setError(null);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }
      
      // Mark the OTP as used using our custom hook
      const marked = await markOTPAsUsed(resetEmail, resetOtp);
      
      if (!marked) {
        throw new Error("Verification failed. Please restart the password reset process.");
      }
      
      // Use the updateUserPassword method instead, which doesn't require an active session
      const { error: updateError } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        { redirectTo: window.location.origin + '/login' }
      );

      if (updateError) {
        throw new Error(updateError.message || "Failed to update password.");
      }
      
      // Actually set the new password after getting the user's email through the resetPasswordForEmail flow
      const { error: setPasswordError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (setPasswordError) {
        console.error("Error setting new password:", setPasswordError);
        // Still show success since the reset email will be sent
      }
      
      setPasswordUpdated(true);
      toast({
        title: "Password Reset Link Sent",
        description: "A password reset link has been sent to your email. Please check your inbox to complete the process.",
      });
      
      // Close the dialog if onClose is provided
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const resendOtp = async () => {
    setResetLoading(true);
    setError(null);
    
    try {
      // Generate a new OTP using our custom hook
      const generatedOTP = await createOTP(resetEmail);
      
      if (!generatedOTP) {
        throw new Error("Failed to resend OTP. Please try again.");
      }
      
      console.log("Resending OTP - Generated:", generatedOTP);
      
      // Call the edge function to send email
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: resetEmail,
          name: "",
          type: "password-reset",
          otp: generatedOTP
        })
      });

      const responseData = await response.json();
      console.log("Edge function response (resend):", responseData);

      if (!response.ok) {
        console.error("Error response:", responseData);
        throw new Error(responseData.error || "Failed to resend OTP. Please try again.");
      }

      setOtpSent(true);
      toast({
        title: "OTP Resent",
        description: "A new one-time password has been sent to your email.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return {
    resetPasswordStep,
    setResetPasswordStep,
    resetEmail,
    setResetEmail,
    resetOtp,
    setResetOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    resetLoading,
    otpError,
    error,
    handleSendResetOtp,
    handleVerifyOtp,
    handleResetPassword,
    resendOtp
  };
};

export default usePasswordReset;
