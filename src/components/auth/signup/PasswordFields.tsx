
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface PasswordFieldsProps {
  form: UseFormReturn<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    captcha: string;
    role: "student" | "teacher";
  }>;
}

const PasswordFields = ({ form }: PasswordFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input type="password" placeholder="Create a password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input type="password" placeholder="Confirm your password" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PasswordFields;
