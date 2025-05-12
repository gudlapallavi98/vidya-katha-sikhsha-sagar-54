
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, AlertCircle } from "lucide-react";

interface OtpStepProps {
  resetOtp: string;
  setResetOtp: (otp: string) => void;
  onVerifyOtp: () => void;
  onBack: () => void;
  onResendCode: () => void;
  resetLoading: boolean;
  otpError?: string;
}

const OtpStep = ({ 
  resetOtp, 
  setResetOtp, 
  onVerifyOtp, 
  onBack, 
  onResendCode, 
  resetLoading,
  otpError
}: OtpStepProps) => {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Set up timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Handle resend click
  const handleResend = () => {
    if (canResend && !resetLoading) {
      setResendTimer(60);
      setCanResend(false);
      onResendCode();
    }
  };

  return (
    <>
      <p className="text-sm text-center mb-4 text-gray-600">
        Enter the 6-digit code sent to your email
      </p>

      <div className="flex justify-center py-4">
        <InputOTP 
          maxLength={6} 
          value={resetOtp} 
          onChange={(value) => setResetOtp(value)}
          disabled={resetLoading}
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
      
      {otpError && (
        <p className="text-xs text-red-500 mt-1 mb-4 text-center flex items-center justify-center gap-1">
          <AlertCircle size={12} />
          {otpError}
        </p>
      )}
      
      <div className="flex flex-col space-y-2">
        <Button 
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
          onClick={onVerifyOtp}
          disabled={resetLoading || resetOtp.length !== 6}
        >
          {resetLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>
        
        <div className="flex justify-between items-center">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            disabled={resetLoading}
          >
            Back
          </Button>
          
          <Button 
            type="button" 
            variant={canResend ? "link" : "ghost"}
            size="sm"
            onClick={handleResend}
            disabled={!canResend || resetLoading}
            className={canResend ? "text-indian-blue" : "text-gray-400"}
          >
            {resetLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : canResend ? (
              "Resend Code"
            ) : (
              `Resend in ${resendTimer}s`
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default OtpStep;
