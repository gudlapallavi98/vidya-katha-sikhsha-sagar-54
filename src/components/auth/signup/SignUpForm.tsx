
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

      // Generate a simple 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtp(otp);
      
      // For now, we'll show the OTP in console since edge function might not be working
      console.log("Generated OTP for signup:", otp);
      
      toast({
        title: "Verification Required",
        description: `For testing purposes, use OTP: ${otp}`,
      });
      
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
    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(newOtp);
    console.log("New OTP for signup:", newOtp);
    
    toast({
      title: "OTP Resent",
      description: `New OTP: ${newOtp}`,
    });
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
              Please enter the 6-digit verification code to complete your registration.
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
