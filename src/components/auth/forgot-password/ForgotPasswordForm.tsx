
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email required",
        description: "Please enter your email address",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, check if the email exists in the database
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error("Error checking email:", userError);
        throw new Error(userError.message);
      }
      
      if (!userData) {
        toast({
          variant: "destructive",
          title: "Email not found",
          description: "The email you entered is not registered in our system.",
        });
        setIsLoading(false);
        return;
      }
      
      // Email exists, send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password`,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Reset Link Sent",
        description: "Check your email for a password reset link",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send reset link",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Invalid password",
        description: "Password must be at least 6 characters",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use Supabase's updateUser function to reset the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully",
      });
      
      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the URL has the access_token query parameter, which indicates
  // the user has clicked on the reset password link in their email
  const hasAccessToken = window.location.hash.includes('access_token');

  if (hasAccessToken || isResetting) {
    return (
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            New Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        
        <Button 
          className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendResetLink} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <Button 
        className="w-full bg-indian-saffron hover:bg-indian-saffron/90" 
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
