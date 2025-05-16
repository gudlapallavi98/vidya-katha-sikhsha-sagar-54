
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import OTPInput from "./OTPInput";
import { supabase } from "@/integrations/supabase/client";

interface ProfileResponse {
  id?: string;
}

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, check if the email exists in the database
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle<ProfileResponse>();
      
      if (userError || !userData?.id) {
        toast({
          variant: "destructive",
          title: "Email not found",
          description: "The email you entered is not registered in our system.",
        });
        setIsLoading(false);
        return;
      }
      
      // Email exists, send OTP via Resend Edge Function
      const response = await fetch(
        `https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            type: "password-reset"
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification email");
      }
      
      setSentOtp(data.otp);
      setOtpSent(true);
      
      toast({
        title: "OTP Sent",
        description: "Check your email for a verification code",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (otp !== sentOtp) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The verification code is incorrect",
      });
      return;
    }
    
    setIsResetting(true);
    setOtpSent(false);
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "Password must be at least 6 characters",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use Supabase's password reset functionality with the user's email
      const response = await fetch(
        `https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: newPassword,
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password");
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully",
      });
      
      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    setIsLoading(true);
    
    try {
      // Send OTP via Resend Edge Function
      const response = await fetch(
        `https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            type: "password-reset"
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification email");
      }
      
      setSentOtp(data.otp);
      
      toast({
        title: "OTP Resent",
        description: "Check your email for a new verification code",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend OTP",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetting) {
    return (
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <Button 
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    );
  }

  return (
    <>
      <form onSubmit={handleSendOTP} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button 
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
      
      <Dialog open={otpSent} onOpenChange={setOtpSent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              We've sent a verification code to {email}.<br/>
              Enter the code below to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <OTPInput 
              value={otp}
              onChange={setOtp}
              length={6}
            />
            
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={handleVerifyOTP}
                className="w-full bg-indian-saffron hover:bg-indian-saffron/90"
                disabled={otp.length !== 6}
              >
                Verify Code
              </Button>
              
              <Button
                variant="outline"
                onClick={handleResendOTP}
                className="w-full"
                disabled={isLoading}
              >
                Resend Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ForgotPasswordForm;
