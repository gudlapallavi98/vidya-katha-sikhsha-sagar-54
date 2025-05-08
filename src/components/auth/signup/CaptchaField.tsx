
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CaptchaFieldProps {
  captchaValue: { num1: number; num2: number };
  userCaptcha: string;
  setUserCaptcha: (value: string) => void;
}

const CaptchaField = ({ captchaValue, userCaptcha, setUserCaptcha }: CaptchaFieldProps) => {
  return (
    <div className="space-y-2 p-4 rounded-md bg-muted">
      <Label htmlFor="captcha">
        Verify you're human: What is {captchaValue.num1} + {captchaValue.num2}? <span className="text-red-500">*</span>
      </Label>
      <Input 
        id="captcha"
        type="text"
        placeholder="Enter the answer"
        value={userCaptcha}
        onChange={(e) => setUserCaptcha(e.target.value)}
        required
      />
    </div>
  );
};

export default CaptchaField;
