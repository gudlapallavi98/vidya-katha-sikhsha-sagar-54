
import { GraduationCap } from "lucide-react";

const LoginHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <GraduationCap className="h-12 w-12 text-indian-saffron mb-4" />
      <h1 className="font-sanskrit text-3xl font-bold text-center">
        <span className="text-indian-saffron">e</span>
        <span className="text-indian-blue">tutors</span>
        <span className="text-green-500">s</span>
      </h1>
      <p className="text-muted-foreground text-center mt-2">
        Sign in to your account
      </p>
    </div>
  );
};

export default LoginHeader;
