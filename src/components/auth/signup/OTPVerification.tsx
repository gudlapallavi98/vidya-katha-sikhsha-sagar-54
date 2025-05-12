
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

interface OTPVerificationProps {
  email: string;
  name: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  isLoading: boolean;
}

const OTPVerification = ({ 
  email, 
  name, 
  onVerify, 
  onResend, 
  isLoading 
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter the 6-digit verification code",
      });
      return;
    }
    
    onVerify(otp);
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
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
      
      <div className="flex flex-col w-full space-y-2">
        <Button 
          onClick={handleVerify}
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90"
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
        
        <Button 
          variant="outline"
          onClick={onResend}
          className="w-full"
          type="button"
        >
          Resend Code
        </Button>
      </div>
    </div>
  );
};

export default OTPVerification;
