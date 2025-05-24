
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SignUpFormFields from "./SignUpFormFields";
import OTPVerification from "./OTPVerification";
import { useSignUpForm } from "./hooks/useSignUpForm";
import { CaptchaValue } from "./types";

interface SignUpFormProps {
  captchaValue: CaptchaValue;
}

const SignUpForm = ({ captchaValue }: SignUpFormProps) => {
  const {
    isLoading,
    verificationOpen,
    setVerificationOpen,
    verificationEmail,
    verificationName,
    handleFormSubmit,
    handleVerify,
    handleResendOtp,
  } = useSignUpForm();

  return (
    <>
      <SignUpFormFields 
        captchaValue={captchaValue}
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
      />
      
      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              Please enter the 6-digit verification code sent to your email to complete your registration.
            </DialogDescription>
          </DialogHeader>
          
          <OTPVerification
            email={verificationEmail}
            name={verificationName}
            onVerify={handleVerify}
            onResend={handleResendOtp}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignUpForm;
