
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
  const [serverOtp, setServerOtp] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (email: string, name: string) => {
    try {
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54ZHNzemRvYmdiaWtybnFxcnVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwOTQzMTYsImV4cCI6MjA2MTY3MDMxNn0.G98OnCs8p1nglvP0qmnaOllhUFIJIuSw2iiaci1OOJo`,
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
      
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification code",
      });
      
      // Store the server OTP for verification
      setServerOtp(responseData.otp || "");
      return responseData.otp;
    } catch (error) {
      console.error("OTP sending error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification email",
      });
      return null;
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

      const otpCode = await sendOtp(data.email, `${data.firstName} ${data.lastName}`);
      if (otpCode) {
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

  const handleVerify = async (otp: string, providedServerOtp: string) => {
    // Use the stored server OTP if not provided
    const otpToCheck = providedServerOtp || serverOtp;
    
    if (otp !== otpToCheck) {
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
    
    const otpCode = await sendOtp(formValues.email, `${formValues.firstName} ${formValues.lastName}`);
    if (otpCode) {
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
