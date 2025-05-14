
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import BasicInfoFields from "./BasicInfoFields";
import PasswordFields from "./PasswordFields";
import RoleSelector from "./RoleSelector";
import CaptchaField from "./CaptchaField";
import { useToast } from "@/hooks/use-toast";

// Form schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  captcha: z.string(),
  role: z.enum(["student", "teacher"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof formSchema>;

interface SignUpFormFieldsProps {
  captchaValue: {
    num1: number;
    num2: number;
  };
  isLoading: boolean;
  onSubmit: (data: SignUpFormData) => void;
}

const SignUpFormFields = ({ captchaValue, isLoading, onSubmit }: SignUpFormFieldsProps) => {
  const { toast } = useToast();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      captcha: "",
      role: "student",
    },
  });

  const handleFormSubmit = (data: SignUpFormData) => {
    // Validate captcha
    const captchaAnswer = (captchaValue.num1 + captchaValue.num2).toString();
    if (data.captcha !== captchaAnswer) {
      toast({
        variant: "destructive",
        title: "Invalid captcha",
        description: "Please solve the math problem correctly",
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <BasicInfoFields form={form} />
        <PasswordFields form={form} />
        <RoleSelector form={form} />
        <CaptchaField form={form} captchaValue={captchaValue} />
        
        <Button 
          type="submit" 
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpFormFields;
