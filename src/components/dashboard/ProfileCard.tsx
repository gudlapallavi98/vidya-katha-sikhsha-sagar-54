
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/use-profile-data";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";

interface ProfileCardProps {
  role: "student" | "teacher";
}

const ProfileCard: React.FC<ProfileCardProps> = ({ role }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const { data: profile } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  
  const handleSettings = () => {
    setShowProfileSettings(true);
  };

  const goToDashboard = () => {
    if (role === "teacher") {
      navigate("/teacher-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback>
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-0.5">
          <p className="text-sm font-medium">
            {profile?.first_name
              ? `${profile.first_name} ${profile?.last_name || ""}`
              : user?.email?.split("@")[0]}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {role === "teacher" ? "Teacher" : "Student"} Dashboard
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={goToDashboard}>
            <div className="flex items-center">
              Dashboard
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettings}>
            <div className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              Profile Settings
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <div className="flex items-center text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
        <DialogContent className="max-w-4xl">
          <ProfileSettingsForm role={role} onCompleted={() => setShowProfileSettings(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileCard;
