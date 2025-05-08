
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RoleSelectorProps {
  role: string;
  handleRoleChange: (value: string) => void;
}

const RoleSelector = ({ role, handleRoleChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>I am a <span className="text-red-500">*</span></Label>
      <RadioGroup 
        value={role}
        onValueChange={handleRoleChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student">Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teacher" id="teacher" />
          <Label htmlFor="teacher">Teacher</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RoleSelector;
