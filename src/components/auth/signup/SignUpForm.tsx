
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignUpFormFields, { SignUpFormData } from "./SignUpFormFields";
import OTPVerification from "./OTPVerification";

interface SignUpFormProps {
  captchaValue: {
    num1: number;
    num2: number;
  };
  onValidationError?: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ captchaValue, onValidationError }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationName, setVerificationName] = useState("");
  const [formValues, setFormValues] = useState<Partial<SignUpFormData> | null>(null);
  const [sentOtp, setSentOtp] = useState("");
  const navigate = useNavigate();
  
  const handleFormSubmit = async (data: SignUpFormData) => {
    // Validate CAPTCHA
    const captchaAnswer = Number(data.captcha);
    if (captchaAnswer !== captchaValue.num1 + captchaValue.num2) {
      toast({
        variant: "destructive",
        title: "Invalid CAPTCHA",
        description: "The CAPTCHA answer is incorrect. Please try again.",
      });
      if (onValidationError) onValidationError();
      return;
    }
    
    try {
      setIsLoading(true);
      setFormValues(data);
      setVerificationEmail(data.email);
      setVerificationName(`${data.firstName} ${data.lastName}`);
      
      // Generate a 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("SignUp - Generated OTP:", generatedOTP);
      
      // Store OTP in the database
      const { error: storeOtpError } = await supabase
        .from("signup_otps")
        .insert([
          { 
            email: data.email, 
            otp: generatedOTP, 
            expires_at: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes expiry
            user_data: {
              firstName: data.firstName,
              lastName: data.lastName,
              role: data.role
            }
          }
        ]);
        
      if (storeOtpError) {
        console.error("Failed to store signup OTP:", storeOtpError);
        throw new Error("Failed to initiate signup process. Please try again.");
      }
      
      try {
        // Direct call to the send-email edge function
        const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            name: `${data.firstName} ${data.lastName}`,
            type: "signup",
            otp: generatedOTP
          })
        });
        
        const responseData = await response.json();
        console.log("SignUp - Edge function response:", responseData);
        
        if (!response.ok) {
          const errorMessage = responseData.error || "Failed to send verification email";
          console.error("Send OTP error response:", errorMessage);
          throw new Error(errorMessage);
        }
        
        // Store the OTP
        setSentOtp(generatedOTP);
        
        // Open verification dialog
        setVerificationOpen(true);
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Something went wrong",
        });
        if (onValidationError) onValidationError();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      if (onValidationError) onValidationError();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerify = async (otp: string) => {
    console.log("Verifying OTP - Entered:", otp);
    
    setIsLoading(true);
    
    try {
      // Verify OTP from the database
      const { data: otpData, error: fetchError } = await supabase
        .from("signup_otps")
        .select("*")
        .eq("email", verificationEmail)
        .eq("otp", otp)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !otpData) {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: "The verification code is incorrect or expired",
        });
        return;
      }
      
      if (!formValues) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Form data lost. Please try signing up again.",
        });
        return;
      }
      
      // Mark OTP as verified
      await supabase
        .from("signup_otps")
        .update({ verified: true })
        .eq("id", otpData.id);
      
      // Sign up with Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formValues.email,
        password: formValues.password,
      });
      
      if (signUpError) throw signUpError;
      
      // Create profile in the database
      if (signUpData?.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: signUpData.user.id,
          first_name: formValues.firstName,
          last_name: formValues.lastName,
          email: formValues.email,
          role: formValues.role,
        });
        
        if (profileError) throw profileError;
        
        // Mark OTP as used
        await supabase
          .from("signup_otps")
          .update({ used: true })
          .eq("id", otpData.id);
      }
      
      // Success message
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
      // Close dialog and navigate
      setVerificationOpen(false);
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to create account",
      });
      if (onValidationError) onValidationError();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (!verificationEmail) return;
    
    setIsLoading(true);
    
    try {
      // Generate a new 6-digit OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("SignUp Resend - Generated OTP:", generatedOTP);
      
      // Store the new OTP in the database
      const { error: storeOtpError } = await supabase
        .from("signup_otps")
        .insert([
          { 
            email: verificationEmail, 
            otp: generatedOTP, 
            expires_at: new Date(Date.now() + 15 * 60000).toISOString(), // 15 minutes expiry
            user_data: formValues ? {
              firstName: formValues.firstName,
              lastName: formValues.lastName,
              role: formValues.role
            } : null
          }
        ]);
        
      if (storeOtpError) {
        console.error("Failed to store signup OTP:", storeOtpError);
        throw new Error("Failed to resend verification code. Please try again.");
      }
      
      // Direct call to the send-email edge function
      const response = await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
          name: verificationName,
          type: "signup",
          otp: generatedOTP
        })
      });
      
      const responseData = await response.json();
      console.log("SignUp Resend - Edge function response:", responseData);
      
      if (!response.ok) {
        const errorMessage = responseData.error || "Failed to resend verification email";
        console.error("Resend OTP error:", errorMessage);
        throw new Error(errorMessage);
      }
      
      // Update the stored OTP
      setSentOtp(generatedOTP);
      
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification code",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SignUpFormFields 
        captchaValue={captchaValue}
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
        onCaptchaRefresh={onValidationError}
      />
      
      {/* OTP Verification Dialog */}
      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              We've sent a verification code to {verificationEmail}. 
              Please enter the 6-digit code below.
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
