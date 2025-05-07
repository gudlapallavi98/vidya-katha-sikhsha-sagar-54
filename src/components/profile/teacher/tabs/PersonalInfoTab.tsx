
import { UseFormReturn } from "react-hook-form";
import { ProfileAvatarSection } from "../../form-sections/ProfileAvatarSection";
import BasicInfoSection from "../../form-sections/BasicInfoSection";
import LocationSection from "../../form-sections/LocationSection";
import BioSection from "../../form-sections/BioSection";

interface PersonalInfoTabProps {
  form: UseFormReturn<any>;
  avatarUrl: string | null;
  setAvatarUrl: (url: string) => void;
  userId: string;
}

export function PersonalInfoTab({ form, avatarUrl, setAvatarUrl, userId }: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Personal Information</h3>
      <p className="text-sm text-muted-foreground">
        Update your personal information and how others will see you on the platform.
      </p>

      <ProfileAvatarSection 
        avatarUrl={avatarUrl} 
        userId={userId} 
        onAvatarUpload={setAvatarUrl} 
      />
      
      <BasicInfoSection form={form} />
      <LocationSection form={form} />
      <BioSection form={form} />
    </div>
  );
}
