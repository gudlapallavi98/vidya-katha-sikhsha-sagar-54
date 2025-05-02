
import { UseFormReturn } from "react-hook-form";
import NameFields from "./name-fields/NameFields";
import GenderSelector from "./gender/GenderSelector";
import DateOfBirthSelector from "./date-of-birth/DateOfBirthSelector";

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NameFields form={form} />
      <GenderSelector form={form} />
      <DateOfBirthSelector form={form} />
    </div>
  );
};

export default BasicInfoSection;
