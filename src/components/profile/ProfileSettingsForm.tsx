
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "./ProfileForm";

interface ProfileSettingsFormProps {
  role: "student" | "teacher";
  onCompleted?: () => void;
}

function ProfileSettingsForm({ role, onCompleted }: ProfileSettingsFormProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <ProfileForm role={role} onCompleted={onCompleted} />
      </CardContent>
    </Card>
  );
}

export default ProfileSettingsForm;
