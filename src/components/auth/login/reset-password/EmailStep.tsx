
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailStepProps {
  resetEmail: string;
  setResetEmail: (email: string) => void;
  onSendResetOtp: () => void;
  resetLoading: boolean;
}

const EmailStep = ({ resetEmail, setResetEmail, onSendResetOtp, resetLoading }: EmailStepProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="resetEmail">Email</Label>
      <Input
        id="resetEmail"
        type="email"
        value={resetEmail}
        onChange={(e) => setResetEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <Button 
        className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
        onClick={onSendResetOtp}
        disabled={resetLoading}
      >
        {resetLoading ? "Sending..." : "Send Verification Code"}
      </Button>
    </div>
  );
};

export default EmailStep;
