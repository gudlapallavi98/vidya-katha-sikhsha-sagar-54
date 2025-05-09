import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BasicInfoFields from "./BasicInfoFields";
import PasswordFields from "./PasswordFields";
import RoleSelector from "./RoleSelector";
import CaptchaField from "./CaptchaField";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface SignUpFormProps {
  captchaValue: { num1: number; num2: number };
}

const SignUpForm = ({ captchaValue }: SignUpFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userCaptcha, setUserCaptcha] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    password: "",
    confirmPassword: "",
    role: "student"
  });
  const [step, setStep] = useState<"info" | "otp">("info");
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      role: value
    }));
  };

  const sendOtp = async () => {
    try {
      if (!formData.email) {
        throw new Error("Email is required");
      }
      
      setIsLoading(true);
      
      try {
        // Use the Supabase Edge Function to send a real email with OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        setSentOtp(generatedOtp);
        
        const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            name: formData.name,
            type: "signup"
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error("Email sending error:", data);
          throw new Error(data.error || "Failed to send verification email");
        }
        
        // Use the OTP from the server response
        if (data.otp) {
          setSentOtp(data.otp);
        }
        
        toast({
          title: "Verification Code Sent",
          description: "Please check your email for the verification code",
        });
        
        setStep("otp");
      } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send OTP",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (step === "info") {
      try {
        // Validate form
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          throw new Error("Please fill in all required fields");
        }
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        // Validate captcha
        if (parseInt(userCaptcha) !== captchaValue.num1 + captchaValue.num2) {
          throw new Error("Incorrect captcha answer");
        }
        
        await sendOtp();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error instanceof Error ? error.message : "Something went wrong",
        });
      }
      return;
    }
    
    // If we're in OTP step
    setIsLoading(true);
    
    try {
      // Validate OTP
      if (otp.length !== 6) {
        throw new Error("Please enter the complete 6-digit OTP");
      }
      
      // In a real app, validate OTP server-side
      if (otp !== sentOtp) {
        throw new Error("Incorrect OTP. Please check and try again");
      }
      
      // Sign up with Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.name.split(' ')[0],
            last_name: formData.name.split(' ').slice(1).join(' ') || '',
            role: formData.role
          }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        console.log("User created successfully:", authData.user.id);
        
        // Create profile entry with explicit user ID
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              first_name: formData.name.split(' ')[0],
              last_name: formData.name.split(' ').slice(1).join(' ') || '',
              role: formData.role
            }
          ]);
        
        if (profileError) {
          console.error("Profile creation error:", profileError);
          
          // Check if it's a duplicate key error (profile might already exist)
          if (profileError.code === '23505') {
            console.log("Profile already exists - continuing with login flow");
            // Profile already exists (could happen with auth changes) - continue with login flow
          } else {
            // For other profile errors, show the error but don't prevent login
            toast({
              variant: "destructive",
              title: "Profile setup issue",
              description: "Your account was created but profile setup failed. Some features may be limited.",
            });
          }
        }
        
        toast({
          title: "Registration Successful!",
          description: "Welcome to etutorss. Your account has been created.",
        });
        
        // Redirect based on role
        if (formData.role === "student") {
          navigate("/student-dashboard");
        } else {
          navigate("/teacher-dashboard");
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {step === "info" ? (
        <div className="space-y-4">
          <BasicInfoFields 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <PasswordFields 
            formData={formData} 
            handleInputChange={handleInputChange} 
          />
          
          <RoleSelector 
            role={formData.role} 
            handleRoleChange={handleRoleChange} 
          />
          
          <CaptchaField 
            captchaValue={captchaValue} 
            userCaptcha={userCaptcha}
            setUserCaptcha={setUserCaptcha}
          />
          
          <Button className="w-full mt-6 bg-indian-saffron hover:bg-indian-saffron/90" type="submit" disabled={isLoading}>
            {isLoading ? "Sending Verification..." : "Continue"}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium">Verify your email</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enter the 6-digit code sent to {formData.email}
            </p>
          </div>
          
          <div className="flex justify-center py-4">
            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
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
            <Button className="w-full bg-indian-saffron hover:bg-indian-saffron/90" type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              className="text-sm" 
              onClick={() => setStep("info")}
              disabled={isLoading}
            >
              Back
            </Button>
            
            <Button 
              type="button" 
              variant="link" 
              className="text-sm text-indian-blue" 
              onClick={sendOtp}
              disabled={isLoading}
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default SignUpForm;
