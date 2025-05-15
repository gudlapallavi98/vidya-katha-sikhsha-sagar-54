
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

interface EmailStepProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  onSendResetOtp: () => void;
  resetLoading: boolean;
}

const EmailStep: React.FC<EmailStepProps> = ({ 
  resetEmail, 
  setResetEmail, 
  onSendResetOtp,
  resetLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="Enter your registered email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        We'll send you a password reset link to your email address.
      </p>
      <div className="flex justify-end">
        <Button 
          type="button" 
          onClick={onSendResetOtp}
          disabled={resetLoading}
          className="bg-indian-saffron hover:bg-indian-saffron/90"
        >
          {resetLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </div>
    </div>
  );
};

export default EmailStep;
