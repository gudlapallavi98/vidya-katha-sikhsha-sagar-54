
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FileUpload from "@/components/FileUpload";
import { User, Upload } from "lucide-react";

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
    <div className="flex flex-col items-center mb-6 space-y-4">
      <Avatar className="h-24 w-24">
        {avatarUrl ? (
          <AvatarImage src={avatarUrl} alt="User avatar" />
        ) : (
          <AvatarFallback className="bg-muted">
            <User className="h-12 w-12 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <FileUpload 
        bucket="avatars"
        folder={`user-${userId}`}
        onFileUploaded={onAvatarUpload}
        acceptedFileTypes="image/*"
        buttonLabel="Upload Profile Picture"
      />
    </div>
  );
}
