
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { SignUpFormData, CaptchaValue } from "./types";

interface CaptchaFieldProps {
  captchaValue: CaptchaValue;
  form: UseFormReturn<SignUpFormData>;
}

const CaptchaField = ({ captchaValue, form }: CaptchaFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="captcha"
      render={({ field }) => (
        <FormItem className="space-y-2 p-4 rounded-md bg-muted">
          <FormLabel htmlFor="captcha">
            Verify you're human: What is {captchaValue.num1} + {captchaValue.num2}? <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <Input 
              id="captcha"
              type="text"
              placeholder="Enter the answer"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CaptchaField;
