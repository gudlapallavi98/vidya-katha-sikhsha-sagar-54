
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  email: string;
  name: string;
  onVerify: (otp: string, serverOtp: string) => void;
  onResend: () => void;
  isLoading: boolean;
}

const OTPVerification = ({ email, name, onVerify, onResend, isLoading }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const { toast } = useToast();

  // Fetch OTP from server when component mounts
  const fetchOtp = async () => {
    try {
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZHNzemRvYmdiaWtybnFxcnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTQzMTYsImV4cCI6MjA2MTY3MDMxNn0.G98OnCs8p1nglvP0qmnaOllhUFIJIuSw2iiaci1OOJo`,
        },
        body: JSON.stringify({
          email,
          name,
          type: "signup"
        })
      });

      const responseData = await response.json();
      if (response.ok && responseData.otp) {
        setServerOtp(responseData.otp);
      }
    } catch (error) {
      console.error("Error fetching OTP:", error);
    }
  };

  React.useEffect(() => {
    fetchOtp();
  }, []);

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code",
      });
      return;
    }
    
    onVerify(otp, serverOtp);
  };

  const handleResend = async () => {
    await onResend();
    await fetchOtp(); // Fetch new OTP after resend
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          We've sent a 6-digit verification code to <strong>{email}</strong>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(value) => setOtp(value)}
        >
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

      <div className="space-y-4">
        <Button 
          onClick={handleVerify}
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>

        <Button 
          variant="outline" 
          onClick={handleResend}
          className="w-full"
          disabled={isLoading}
        >
          Resend Code
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
