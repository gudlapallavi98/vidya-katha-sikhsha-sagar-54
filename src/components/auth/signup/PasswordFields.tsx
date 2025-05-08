
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldsProps {
  formData: {
    password: string;
    confirmPassword: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordFields = ({ formData, handleInputChange }: PasswordFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
        <Input 
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
        <Input 
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
        />
      </div>
    </>
  );
};

export default PasswordFields;
