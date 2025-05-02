
import { FileUpload } from "@/components/ui/file-upload";

interface ProfileAvatarSectionProps {
  avatarUrl: string | null;
  userId: string;
  onAvatarUpload: (url: string) => void;
}

export function ProfileAvatarSection({ 
  avatarUrl, 
  userId, 
  onAvatarUpload 
}: ProfileAvatarSectionProps) {
  return (
    <div className="flex justify-center mb-6">
      <FileUpload 
        onUploadComplete={onAvatarUpload} 
        currentImageUrl={avatarUrl} 
        userId={userId}
      />
    </div>
  );
}
