
import { GraduationCap } from "lucide-react";

const SignUpHeader = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <GraduationCap className="h-12 w-12 text-indian-saffron mb-4" />
      <h1 className="font-sanskrit text-3xl font-bold text-center">
        Join <span className="text-indian-saffron">Etutors</span><span className="text-green-500">s</span>
      </h1>
      <p className="text-muted-foreground text-center mt-2">
        Create an account to start your learning journey
      </p>
    </div>
  );
};

export default SignUpHeader;
