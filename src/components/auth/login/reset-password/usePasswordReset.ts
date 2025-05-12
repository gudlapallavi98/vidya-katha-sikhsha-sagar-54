import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      // Generate a 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
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

      // Store the OTP temporarily in localStorage for verification
      localStorage.setItem("resetPasswordOtp", generatedOTP);
      localStorage.setItem("resetPasswordEmail", resetEmail);
      
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
      console.log("Verifying OTP - Stored:", storedOTP, "Entered:", resetOtp);
      
      if (!storedOTP || resetOtp !== storedOTP) {
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
      const storedEmail = localStorage.getItem("resetPasswordEmail");
      
      if (!storedEmail) {
        throw new Error("Email not found. Please restart the password reset process.");
      }
      
      // Simply using the resetPasswordForEmail method
      const { error: passwordResetError } = await supabase.auth.resetPasswordForEmail(
        storedEmail
      );

      if (passwordResetError) {
        throw new Error(passwordResetError.message || "Failed to initiate password reset.");
      }
      
      setPasswordUpdated(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for a link to reset your password.",
      });
      
      // Clean up
      localStorage.removeItem("resetPasswordOtp");
      localStorage.removeItem("resetPasswordEmail");
      
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
      // Generate a new OTP and send it
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
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

      // Update the stored OTP
      localStorage.setItem("resetPasswordOtp", generatedOTP);
      localStorage.setItem("resetPasswordEmail", resetEmail);

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
