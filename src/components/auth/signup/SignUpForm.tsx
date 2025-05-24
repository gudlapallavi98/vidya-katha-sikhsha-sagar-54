
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SignUpFormFields from "./SignUpFormFields";
import OTPVerification from "./OTPVerification";
import { SignUpFormData, CaptchaValue } from "./types";

interface SignUpFormProps {
  captchaValue: CaptchaValue;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ captchaValue }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationName, setVerificationName] = useState("");
  const [formValues, setFormValues] = useState<SignUpFormData | null>(null);
  const [sentOtp, setSentOtp] = useState("");
  const navigate = useNavigate();
  
  const handleFormSubmit = async (data: SignUpFormData) => {
    setFormValues(data);
    setVerificationEmail(data.email);
    setVerificationName(`${data.firstName} ${data.lastName}`);
    
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', data.email)
        .single();

      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Account already exists",
          description: "An account with this email already exists. Please login instead.",
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
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          type: "signup"
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to send verification email");
      }

      setSentOtp(responseData.otp);
      
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification code",
      });
      
      setVerificationOpen(true);
    } catch (error) {
      console.error("Signup error:", error);
      // Fallback to local OTP for testing
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(otp);
      
      toast({
        title: "Verification Required",
        description: `For testing purposes, use OTP: ${otp}`,
      });
      
      setVerificationOpen(true);
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
        }
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
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
    if (!formValues) return;
    
    try {
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formValues.email,
          name: `${formValues.firstName} ${formValues.lastName}`,
          type: "signup"
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to resend OTP");
      }

      setSentOtp(responseData.otp);
      
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
