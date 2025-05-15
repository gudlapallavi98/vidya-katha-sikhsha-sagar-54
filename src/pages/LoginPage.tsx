
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginHeader from "@/components/auth/login/LoginHeader";
import LoginForm from "@/components/auth/login/LoginForm";
import PasswordResetForm from "@/components/auth/login/PasswordResetForm";

const LoginPage = () => {
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);

  const handleOpenResetPassword = () => {
    setResetPasswordOpen(true);
  };

  const handleCloseResetPassword = () => {
    setResetPasswordOpen(false);
  };

  return (
    <div className="container max-w-md py-12 bg-orange-50">
      <LoginHeader />

      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onForgotPassword={handleOpenResetPassword} />
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            Don't have an account? <Link to="/signup" className="text-indian-blue hover:underline">Sign Up</Link>
          </p>
        </CardFooter>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email to receive a verification code.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <PasswordResetForm onClose={handleCloseResetPassword} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;
