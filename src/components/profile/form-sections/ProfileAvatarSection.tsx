
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FileUpload from "@/components/FileUpload";
import { User, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileAvatarSectionProps {
  avatarUrl: string | null;
  userId: string;
  onAvatarUpload: (url: string) => void;
  userRole?: "student" | "teacher";
  userGender?: string;
}

export function ProfileAvatarSection({ 
  avatarUrl, 
  userId, 
  onAvatarUpload,
  userRole,
  userGender
}: ProfileAvatarSectionProps) {
  const { toast } = useToast();
  const [defaultAvatar, setDefaultAvatar] = useState<string>("");

  useEffect(() => {
    if (!avatarUrl) {
      // Set default avatar based on role and gender
      if (userRole === "teacher") {
        if (userGender === "female") {
          setDefaultAvatar("/lovable-uploads/f239a13a-7b57-40de-9d20-6473ad5e3342.png");
        } else {
          setDefaultAvatar("/lovable-uploads/1997e07e-0ef6-4d6c-b6a9-89b48c9f6d7c.png");
        }
      } else {
        // Student avatars
        if (userGender === "female") {
          setDefaultAvatar("/lovable-uploads/f5c25e26-a0b6-44f9-96bc-f3a700b27118.png");
        } else {
          setDefaultAvatar("/lovable-uploads/014c0867-8f64-428a-8289-de1f6535dc5c.png");
        }
      }
    }
  }, [avatarUrl, userRole, userGender]);

  const handleFileUploaded = (url: string) => {
    console.log("File uploaded successfully:", url);
    onAvatarUpload(url);
  };

  const displayAvatar = avatarUrl || defaultAvatar;

  return (
    <div className="flex flex-col items-center mb-6 space-y-4">
      <Avatar className="h-24 w-24 ring-4 ring-orange-100">
        {displayAvatar ? (
          <AvatarImage src={displayAvatar} alt="User avatar" className="object-cover" />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-orange-100 to-amber-100">
            <User className="h-12 w-12 text-orange-600" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <FileUpload 
        bucket="avatars"
        folder={`user-${userId}`}
        onFileUploaded={handleFileUploaded}
        acceptedFileTypes="image/*"
        buttonLabel="Upload Profile Picture"
        maxFileSizeMB={2}
      />
      
      {!avatarUrl && defaultAvatar && (
        <p className="text-xs text-muted-foreground text-center">
          Default avatar assigned based on your role and gender
        </p>
      )}
    </div>
  );
}
