
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    aadhar: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInfoFields = ({ formData, handleInputChange }: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
        <Input 
          id="name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input 
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone"
          name="phone"
          placeholder="Your phone number"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="aadhar">Aadhar Number (Optional)</Label>
        <Input 
          id="aadhar"
          name="aadhar"
          placeholder="Your Aadhar number"
          value={formData.aadhar}
          onChange={handleInputChange}
        />
        <p className="text-xs text-muted-foreground">For verification purposes only</p>
      </div>
    </>
  );
};

export default BasicInfoFields;
