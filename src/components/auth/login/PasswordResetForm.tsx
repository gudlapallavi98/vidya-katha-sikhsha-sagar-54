
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type ResetStep = "email" | "otp" | "newPassword";

interface PasswordResetFormProps {
  onClose: () => void;
}

const PasswordResetForm = ({ onClose }: PasswordResetFormProps) => {
  const [resetEmail, setResetEmail] = useState("");
  const [resetPasswordStep, setResetPasswordStep] = useState<ResetStep>("email");
  const [resetOtp, setResetOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const { toast } = useToast();
  const { updatePassword } = useAuth();

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
      // First ensure we have a session by requesting a password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + "/login"
      });
      
      if (resetError) throw resetError;
      
      // After OTP verification, update the password directly
      const success = await updatePassword(newPassword);
      
      if (!success) {
        throw new Error("Failed to update password");
      }

      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully. Please log in with your new password.",
      });

      // Reset all states and close dialog
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setResetLoading(false);
    }
  };

  if (resetPasswordStep === "email") {
    return (
      <div className="space-y-2">
        <Label htmlFor="resetEmail">Email</Label>
        <Input
          id="resetEmail"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Button 
          className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
          onClick={handleSendResetOtp}
          disabled={resetLoading}
        >
          {resetLoading ? "Sending..." : "Send Verification Code"}
        </Button>
      </div>
    );
  }

  if (resetPasswordStep === "otp") {
    return (
      <>
        <div className="flex justify-center py-4">
          <InputOTP maxLength={6} value={resetOtp} onChange={(value) => setResetOtp(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button 
            className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
            onClick={handleVerifyOtp}
          >
            Verify Code
          </Button>
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setResetPasswordStep("email")}
            >
              Back
            </Button>
            
            <Button 
              type="button" 
              variant="link" 
              size="sm"
              onClick={handleSendResetOtp}
              disabled={resetLoading}
            >
              {resetLoading ? "Sending..." : "Resend Code"}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>
      
      <Button 
        className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
        onClick={handleResetPassword}
        disabled={resetLoading}
      >
        {resetLoading ? "Resetting..." : "Reset Password"}
      </Button>
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        className="w-full"
        onClick={() => setResetPasswordStep("otp")}
      >
        Back
      </Button>
    </div>
  );
};

export default PasswordResetForm;
