
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
      // First check if the email exists in the system
      // We'll check if a user exists by trying to fetch profiles that match this email
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', resetEmail)
        .limit(1)
        .single();
      
      // If no profile found with this email, show error
      if (profileError || !userProfile) {
        toast({
          variant: "destructive",
          title: "Email Not Found",
          description: "No account exists with this email address",
        });
        setResetLoading(false);
        return;
      }
      
      // Use our edge function to send OTP
      const response = await fetch(
        "https://nxdsszdobgbikrnqqrue.functions.supabase.co/send-email/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
          },
          body: JSON.stringify({
            email: resetEmail,
            type: "password-reset"
          }),
        }
      );
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to send OTP");
      }
      
      // Save the OTP locally for verification
      // In production, this should be handled securely on the server
      setSentOtp(result.otp);
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
      
      // Move to OTP verification step
      setResetPasswordStep("otp");
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (resetOtp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
      });
      return;
    }

    setResetLoading(true);
    
    try {
      // Verify OTP (in production this should be server-side)
      if (resetOtp === sentOtp) {
        // Move to new password step
        setResetPasswordStep("newPassword");
        toast({
          title: "OTP Verified",
          description: "Please set your new password",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: "The code you entered is incorrect",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify OTP",
      });
    } finally {
      setResetLoading(false);
    }
  };

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

    setResetLoading(true);
    
    try {
      // In a real app, you'd call a secure API endpoint to verify the OTP again server-side
      // and then reset the password
      
      // Send a password reset email through Supabase Auth
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        { redirectTo: `${window.location.origin}/login` }
      );
      
      if (resetError) throw resetError;
      
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
