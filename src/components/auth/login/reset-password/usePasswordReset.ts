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
      
      // First store the OTP in the database
      const { error: storeOtpError } = await supabase
        .from("password_reset_otps")
        .insert([
          { 
            email: resetEmail, 
            otp: generatedOTP, 
            expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes expiry
          }
        ]);
        
      if (storeOtpError) {
        console.error("Failed to store OTP:", storeOtpError);
        throw new Error("Failed to initialize password reset. Please try again.");
      }
      
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
      // Verify OTP from the database
      const { data: otpData, error: fetchError } = await supabase
        .from("password_reset_otps")
        .select("*")
        .eq("email", resetEmail)
        .eq("otp", resetOtp)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpData) {
        throw new Error("Invalid or expired OTP. Please try again.");
      }
      
      // Mark OTP as verified
      await supabase
        .from("password_reset_otps")
        .update({ verified: true })
        .eq("id", otpData.id);
      
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
      
      // Verify that the OTP was verified
      const { data: verifiedOtp, error: verificationError } = await supabase
        .from("password_reset_otps")
        .select("*")
        .eq("email", resetEmail)
        .eq("verified", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      if (verificationError || !verifiedOtp) {
        throw new Error("Verification failed. Please restart the password reset process.");
      }
      
      // Update user password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update password.");
      }
      
      // Mark OTP as used
      await supabase
        .from("password_reset_otps")
        .update({ used: true })
        .eq("id", verifiedOtp.id);
      
      setPasswordUpdated(true);
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully. You can now log in with your new password.",
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
      // Generate a new OTP and send it
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Resending OTP - Generated:", generatedOTP);
      
      // Store the new OTP in the database
      const { error: storeOtpError } = await supabase
        .from("password_reset_otps")
        .insert([
          { 
            email: resetEmail, 
            otp: generatedOTP, 
            expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes expiry
          }
        ]);
        
      if (storeOtpError) {
        console.error("Failed to store OTP:", storeOtpError);
        throw new Error("Failed to resend OTP. Please try again.");
      }
      
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
