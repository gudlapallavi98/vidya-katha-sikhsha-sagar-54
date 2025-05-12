
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Check, Loader2 } from "lucide-react";

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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState("");
  
  // Calculate password strength whenever password changes
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      setPasswordFeedback("");
      return;
    }
    
    // Simple password strength algorithm
    let strength = 0;
    
    // Length check
    if (newPassword.length >= 8) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(newPassword)) strength += 25;
    
    // Contains number
    if (/[0-9]/.test(newPassword)) strength += 25;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25;
    
    setPasswordStrength(strength);
    
    // Set feedback based on strength
    if (strength === 0) setPasswordFeedback("");
    else if (strength <= 25) setPasswordFeedback("Weak password");
    else if (strength <= 50) setPasswordFeedback("Fair password");
    else if (strength <= 75) setPasswordFeedback("Good password");
    else setPasswordFeedback("Strong password");
  }, [newPassword]);
  
  // Determine progress bar color based on strength
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };
  
  // Check if passwords match
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  
  return (
    <div className="space-y-4">
      <p className="text-sm mb-2">Enter your new password below.</p>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          disabled={resetLoading}
          className={newPassword ? "" : ""}
        />
        
        {/* Password strength indicator */}
        {newPassword && (
          <div className="space-y-1 mt-1">
            <Progress 
              value={passwordStrength} 
              max={100}
              className={`h-2 ${getStrengthColor()}`} 
            />
            <p className="text-xs flex items-center gap-1">
              {passwordStrength >= 75 && <Check size={12} className="text-green-500" />}
              {passwordFeedback}
            </p>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          disabled={resetLoading}
        />
        
        {/* Show feedback for password match */}
        {confirmPassword && (
          <p className={`text-xs flex items-center gap-1 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
            {passwordsMatch ? (
              <>
                <Check size={12} />
                Passwords match
              </>
            ) : (
              <>
                <AlertCircle size={12} />
                Passwords do not match
              </>
            )}
          </p>
        )}
      </div>
      
      <Button 
        className="w-full mt-2 bg-indian-saffron hover:bg-indian-saffron/90" 
        onClick={onResetPassword}
        disabled={resetLoading || !passwordsMatch || passwordStrength < 50}
      >
        {resetLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting Password...
          </>
        ) : (
          "Reset Password"
        )}
      </Button>
      
      <Button 
        type="button" 
        variant="ghost" 
        size="sm"
        className="w-full"
        onClick={onBack}
        disabled={resetLoading}
      >
        Back
      </Button>
    </div>
  );
};

export default NewPasswordStep;
