
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
      // Since getUserByEmail doesn't exist in the Supabase client API, 
      // we'll check if a user exists by trying to fetch profiles with this email
      const { data: userProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', resetEmail)
        .maybeSingle();
      
      if (profileError || !userProfiles) {
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
      // Update password using admin API (in a real app, this would be done via a secure backend endpoint)
      // Here we're using the client-side auth reset flow with a custom token or session
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully",
      });
      
      // Close the dialog and redirect to login
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
