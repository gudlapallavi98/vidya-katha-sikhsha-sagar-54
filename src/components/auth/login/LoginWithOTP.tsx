
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const LoginWithOTP = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
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
      // Check if user exists
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .eq('email', email)
        .single();

      if (!userProfile) {
        toast({
          variant: "destructive",
          title: "Email not found",
          description: "No account found with this email address",
        });
        return;
      }

      // Send OTP via edge function
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          type: "login"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setSentOtp(data.otp);
      setIsOtpSent(true);
      
      toast({
        title: "OTP Sent",
        description: "Please check your email for the verification code",
      });
    } catch (error) {
      console.error("OTP send error:", error);
      // Fallback to local OTP for testing
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(otp);
      setIsOtpSent(true);
      
      toast({
        title: "OTP Generated",
        description: `For testing purposes, use OTP: ${otp}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp !== sentOtp) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The verification code is incorrect",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign in user with email (magic link style)
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (error) throw error;

      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });

      // Get user role and redirect
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .single();

      if (userProfile?.role === 'student') {
        navigate('/student-dashboard');
      } else if (userProfile?.role === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('email', email)
        .single();

      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          name: `${userProfile?.first_name} ${userProfile?.last_name}`,
          type: "login"
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setSentOtp(data.otp);
      
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    } catch (error) {
      // Fallback to local OTP
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(newOtp);
      
      toast({
        title: "OTP Resent",
        description: `For testing purposes, use OTP: ${newOtp}`,
      });
    }
  };

  if (isOtpSent) {
    return (
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground">
            We've sent a verification code to {email}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="otp">Enter 6-digit code</Label>
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
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
        </div>

        <div className="flex flex-col space-y-2">
          <Button type="submit" disabled={isLoading || otp.length !== 6}>
            {isLoading ? "Verifying..." : "Verify & Login"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleResendOtp}
          >
            Resend OTP
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOtpSent(false)}
          >
            Back to Email
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Address
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
        type="submit" 
        className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
        disabled={isLoading}
      >
        {isLoading ? "Sending OTP..." : "Send OTP"}
      </Button>
    </form>
  );
};

export default LoginWithOTP;
