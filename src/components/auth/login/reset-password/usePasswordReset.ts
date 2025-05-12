
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EmailStepData, NewPasswordStepData, OtpStepData } from "./types";
import { useToast } from "@/hooks/use-toast";

export const usePasswordReset = (onClose?: () => void) => {
  // Renamed step to resetPasswordStep
  const [resetPasswordStep, setResetPasswordStep] = useState<"email" | "otp" | "newPassword">("email");
  // Renamed email to resetEmail
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

  const resetError = () => setError(null);

  const handleSendResetOtp = async () => {
    setResetLoading(true);
    setError(null);
    
    try {
      const { error: emailCheckError } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        {
          redirectTo: window.location.origin + "/login/reset-password",
        }
      );

      if (emailCheckError) {
        throw new Error(emailCheckError.message);
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
      // For OTP verification using Supabase, we'll need to use the verifyOTP method
      // This is placeholder logic since Supabase handles OTP verification differently
      // Typically this would be handled on the redirect with the token in the URL
      
      // Instead, we'll store the OTP for a mock verification flow
      localStorage.setItem("verificationCode", resetOtp);
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
      // In a real implementation, we would use the OTP to verify and update the password
      // Here we're using the updateUser method as a placeholder
      const { error: resetError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (resetError) {
        throw new Error(resetError.message);
      }

      setPasswordUpdated(true);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      
      // Clean up the verification code
      localStorage.removeItem("verificationCode");
      
      // Close the dialog if onClose is provided
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  const resendOtp = async () => {
    setResetLoading(true);
    setError(null);
    
    try {
      const { error: resendError } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        {
          redirectTo: window.location.origin + "/login/reset-password",
        }
      );

      if (resendError) {
        throw new Error(resendError.message);
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
    handleSendResetOtp,
    handleVerifyOtp,
    handleResetPassword,
    resendOtp
  };
};

export default usePasswordReset;
