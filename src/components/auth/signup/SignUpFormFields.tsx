
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import BasicInfoFields from "./BasicInfoFields";
import PasswordFields from "./PasswordFields";
import CaptchaField from "./CaptchaField";
import RoleSelector from "./RoleSelector";

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  captcha: string;
  role: "student" | "teacher";
}

// Extend the component to accept more props
interface SignUpFormFieldsProps {
  captchaValue: { num1: number; num2: number };
  isLoading: boolean;
  onSubmit: (data: SignUpFormData) => void;
  onCaptchaRefresh?: () => void;
}

const SignUpFormFields = ({ 
  captchaValue, 
  isLoading, 
  onSubmit,
  onCaptchaRefresh
}: SignUpFormFieldsProps) => {
  const signUpSchema = z.object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    captcha: z.string().min(1, {
      message: "Please enter the CAPTCHA answer.",
    }),
    role: z.enum(["student", "teacher"]),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

  // Create the form with the correct type
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      captcha: "",
      role: "student"
    }
  });

  const handleSubmit = (data: SignUpFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <PasswordFields form={form} />
        <RoleSelector form={form} />
        <CaptchaField 
          captchaValue={captchaValue} 
          form={form}
          onRefresh={onCaptchaRefresh}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpFormFields;
