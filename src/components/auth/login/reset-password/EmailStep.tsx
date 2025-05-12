
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EmailStepProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  onSendResetOtp: () => void;
  resetLoading: boolean;
}

const EmailStep = ({ resetEmail, setResetEmail, onSendResetOtp, resetLoading }: EmailStepProps) => {
  // Basic email validation
  const isValidEmail = () => {
    return resetEmail.includes('@') && resetEmail.includes('.');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resetEmail">Email</Label>
        <Input
          id="resetEmail"
          type="email"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={resetLoading}
          className="focus:ring-2 focus:ring-offset-1 focus:ring-indian-saffron/50"
        />
        {resetEmail && !isValidEmail() && (
          <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
        )}
      </div>
      <Button 
        className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
        onClick={onSendResetOtp}
        disabled={resetLoading || !isValidEmail()}
      >
        {resetLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Verification Code"
        )}
      </Button>
    </div>
  );
};

export default EmailStep;
