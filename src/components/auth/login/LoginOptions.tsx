
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginWithPassword from "./LoginWithPassword";

const LoginOptions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to Your Account</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginWithPassword />
      </CardContent>
    </Card>
  );
};

export default LoginOptions;
