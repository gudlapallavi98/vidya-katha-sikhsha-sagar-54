
import { useState } from "react";
import { useEmailStep } from "./hooks/useEmailStep";
import { useOtpStep } from "./hooks/useOtpStep";
import { useNewPasswordStep } from "./hooks/useNewPasswordStep";
import { ResetStep } from "./types";

export const usePasswordReset = (onClose: () => void) => {
  // State management
  const [resetEmail, setResetEmail] = useState("");
  const [resetPasswordStep, setResetPasswordStep] = useState<ResetStep>("email");
  const [resetOtp, setResetOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step-specific hooks
  const { isLoading: emailLoading, handleSendResetOtp } = useEmailStep(
    resetEmail,
    setResetPasswordStep,
    setSentOtp
  );

  const { isLoading: otpLoading, handleVerifyOtp, handleResendOtp } = useOtpStep(
    resetOtp,
    sentOtp,
    setResetPasswordStep,
    handleSendResetOtp
  );

  const { isLoading: newPasswordLoading, handleResetPassword } = useNewPasswordStep(
    newPassword,
    confirmPassword,
    resetEmail,
    onClose
  );

  // Determine current loading state based on active step
  const resetLoading = 
    resetPasswordStep === "email" ? emailLoading : 
    resetPasswordStep === "otp" ? otpLoading : 
    newPasswordLoading;

  return {
    // State variables
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
    
    // Actions
    handleSendResetOtp,
    handleVerifyOtp,
    handleResetPassword,
    handleResendOtp
  };
};
