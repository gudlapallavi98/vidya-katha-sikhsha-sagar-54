import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EmailStepData, NewPasswordStepData, OtpStepData } from "./types";
import { useToast } from "@/hooks/use-toast";

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

  const resetError = () => setError(null);

  const handleSendResetOtp = async () => {
    setResetLoading(true);
    setError(null);
    
    try {
      // Instead of using auth.resetPasswordForEmail, we'll use the send-email edge function
      // to send a 6-digit OTP to the user's email
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase.auth.session()?.access_token}`
        },
        body: JSON.stringify({
          email: resetEmail,
          name: "",
          type: "password-reset",
          otp: generatedOTP
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP. Please try again.");
      }

      // Store the OTP temporarily in localStorage for verification
      // In a production app, this should be handled more securely
      localStorage.setItem("resetPasswordOtp", generatedOTP);
      
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
      // Compare the entered OTP with the one we stored
      const storedOTP = localStorage.getItem("resetPasswordOtp");
      
      if (resetOtp !== storedOTP) {
        throw new Error("Invalid OTP. Please check and try again.");
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
      // Instead of using auth.updateUser, we'll use auth.updatePassword
      // which is specifically for password updates
      const { error: resetError } = await supabase.auth.update({
        password: newPassword
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
      localStorage.removeItem("resetPasswordOtp");
      
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
      // Generate a new OTP and send it
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase.auth.session()?.access_token}`
        },
        body: JSON.stringify({
          email: resetEmail,
          name: "",
          type: "password-reset",
          otp: generatedOTP
        })
      });

      if (!response.ok) {
        throw new Error("Failed to resend OTP. Please try again.");
      }

      // Update the stored OTP
      localStorage.setItem("resetPasswordOtp", generatedOTP);

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
