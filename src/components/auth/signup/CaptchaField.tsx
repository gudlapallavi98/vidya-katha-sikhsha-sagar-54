
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CaptchaFieldProps {
  captchaValue: { 
    num1: number; 
    num2: number; 
  };
  form: UseFormReturn<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    captcha?: string;
    role?: "student" | "teacher";
  }>;
  onRefresh?: () => void;
}

const CaptchaField = ({ captchaValue, form, onRefresh }: CaptchaFieldProps) => {
  const [answer, setAnswer] = useState<string>("");
  
  // Reset form field when captcha changes
  useEffect(() => {
    form.setValue("captcha", "");
    setAnswer("");
  }, [captchaValue, form]);

  return (
    <FormField
      control={form.control}
      name="captcha"
      render={({ field }) => (
        <FormItem className="space-y-2 p-4 rounded-md bg-muted">
          <FormLabel htmlFor="captcha" className="flex items-center justify-between">
            <span>Verify you're human: What is {captchaValue.num1} + {captchaValue.num2}? <span className="text-red-500">*</span></span>
            {onRefresh && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
                onClick={onRefresh}
                title="Get a new CAPTCHA"
              >
                <RefreshCw size={16} />
              </Button>
            )}
          </FormLabel>
          <FormControl>
            <Input 
              id="captcha"
              type="text"
              placeholder="Enter the answer"
              {...field}
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                field.onChange(e);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CaptchaField;
