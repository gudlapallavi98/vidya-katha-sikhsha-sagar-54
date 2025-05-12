
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

interface OtpStepProps {
  resetOtp: string;
  setResetOtp: (otp: string) => void;
  onVerifyOtp: () => void;
  onBack: () => void;
  onResendCode: () => void;
  resetLoading: boolean;
}

const OtpStep = ({ 
  resetOtp, 
  setResetOtp, 
  onVerifyOtp, 
  onBack, 
  onResendCode, 
  resetLoading 
}: OtpStepProps) => {
  return (
    <>
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
        
        <div className="flex justify-between">
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
            variant="link" 
            size="sm"
            onClick={onResendCode}
            disabled={resetLoading}
            className="text-indian-blue"
          >
            {resetLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default OtpStep;
