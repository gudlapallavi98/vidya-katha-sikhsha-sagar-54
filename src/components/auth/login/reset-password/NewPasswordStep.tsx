
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewPasswordStepProps {
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  onResetPassword: () => void;
  onBack: () => void;
  resetLoading: boolean;
}

const NewPasswordStep = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onResetPassword,
  onBack,
  resetLoading
}: NewPasswordStepProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>
      
      <Button 
        className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
        onClick={onResetPassword}
        disabled={resetLoading}
      >
        {resetLoading ? "Resetting..." : "Reset Password"}
      </Button>
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        className="w-full"
        onClick={onBack}
      >
        Back
      </Button>
    </div>
  );
};

export default NewPasswordStep;
