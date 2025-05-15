
import EmailStep from "./reset-password/EmailStep";
import OtpStep from "./reset-password/OtpStep";
import NewPasswordStep from "./reset-password/NewPasswordStep";
import { usePasswordReset } from "./reset-password/usePasswordReset";

interface PasswordResetFormProps {
  onClose: () => void;
}

const PasswordResetForm = ({ onClose }: PasswordResetFormProps) => {
  const {
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
  } = usePasswordReset(onClose);

  // Render appropriate step based on current password reset step
  if (resetPasswordStep === "email") {
    return (
      <EmailStep
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        onSendResetOtp={handleSendResetOtp}
        resetLoading={resetLoading}
      />
    );
  }

  if (resetPasswordStep === "otp") {
    return (
      <OtpStep
        resetOtp={resetOtp}
        setResetOtp={setResetOtp}
        onVerifyOtp={handleVerifyOtp}
        onBack={() => setResetPasswordStep("email")}
        onResendCode={handleSendResetOtp}
        resetLoading={resetLoading}
      />
    );
  }

  return (
    <NewPasswordStep
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      onResetPassword={handleResetPassword}
      onBack={() => setResetPasswordStep("otp")}
      resetLoading={resetLoading}
    />
  );
};

export default PasswordResetForm;
