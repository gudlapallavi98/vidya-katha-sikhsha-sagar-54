
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
}

const SignUpForm: React.FC<SignUpFormProps> = ({ captchaValue }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationName, setVerificationName] = useState("");
  const [formValues, setFormValues] = useState<Partial<SignUpFormData> | null>(null);
  const [sentOtp, setSentOtp] = useState("");
  const navigate = useNavigate();
  
  const handleFormSubmit = async (data: SignUpFormData) => {
    setFormValues(data);
    setVerificationEmail(data.email);
    setVerificationName(`${data.firstName} ${data.lastName}`);
    
    try {
      // Use the Supabase Edge Function to send a real email with OTP
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          type: "signup"
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to send verification email");
      }
      
      // Store the OTP from the server response
      if (responseData.otp) {
        setSentOtp(responseData.otp);
      }
      
      // Open verification dialog
      setVerificationOpen(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };
  
  const handleVerify = async (otp: string) => {
    if (otp !== sentOtp) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "The verification code is incorrect",
      });
      return;
    }
    
    if (!formValues) return;
    
    setIsLoading(true);
    
    try {
      // Sign up with Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formValues.email,
        password: formValues.password,
        options: {
          data: {
            first_name: formValues.firstName,
            last_name: formValues.lastName,
            role: formValues.role,
          }
        }
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
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Continue even if profile creation fails - we'll try to handle it gracefully
        }
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
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (!verificationEmail) return;
    
    try {
      // Use the Supabase Edge Function to send a real email with OTP
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
          name: verificationName,
          type: "signup"
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send verification email");
      }
      
      // Store the OTP from the server response
      if (data.otp) {
        setSentOtp(data.otp);
      }
      
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to resend verification code",
      });
    }
  };

  return (
    <>
      <SignUpFormFields 
        captchaValue={captchaValue}
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
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
