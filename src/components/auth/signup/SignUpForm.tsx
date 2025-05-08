
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BasicInfoFields from "./BasicInfoFields";
import PasswordFields from "./PasswordFields";
import RoleSelector from "./RoleSelector";
import CaptchaField from "./CaptchaField";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
          description: "Welcome to Vidya Katha Online. Please check your email for verification.",
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
      </div>
      
      <Button className="w-full mt-6 bg-indian-saffron hover:bg-indian-saffron/90" type="submit" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignUpForm;
