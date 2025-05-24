
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignUpFormData } from "../types";

export const useSignUpForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationName, setVerificationName] = useState("");
  const [formValues, setFormValues] = useState<SignUpFormData | null>(null);
  const [sentOtp, setSentOtp] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (email: string, name: string) => {
    try {
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({
          email,
          name,
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
      
      return true;
    } catch (error) {
      console.error("OTP sending error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification email",
      });
      return false;
    }
  };

  const handleFormSubmit = async (data: SignUpFormData) => {
    setFormValues(data);
    setVerificationEmail(data.email);
    setVerificationName(`${data.firstName} ${data.lastName}`);
    
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('first_name', data.firstName)
        .eq('last_name', data.lastName)
        .single();

      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Account already exists",
          description: "An account with this name already exists. Please login instead.",
        });
        return;
      }

      const success = await sendOtp(data.email, `${data.firstName} ${data.lastName}`);
      if (success) {
        setVerificationOpen(true);
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification email",
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
      
      if (signUpData?.user) {
        let defaultAvatar = "";
        if (formValues.role === "teacher") {
          defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=teacher&backgroundColor=b6e3f4";
        } else {
          defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=student&backgroundColor=c0aede";
        }

        const { error: profileError } = await supabase.from("profiles").insert({
          id: signUpData.user.id,
          first_name: formValues.firstName,
          last_name: formValues.lastName,
          role: formValues.role,
          avatar_url: defaultAvatar,
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
    
    const success = await sendOtp(formValues.email, `${formValues.firstName} ${formValues.lastName}`);
    if (success) {
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email",
      });
    }
  };

  return {
    isLoading,
    verificationOpen,
    setVerificationOpen,
    verificationEmail,
    verificationName,
    handleFormSubmit,
    handleVerify,
    handleResendOtp,
  };
};
