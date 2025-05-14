
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
  className?: string;
  role: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ className, role }) => {
  const { user } = useAuth();
  
  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || role;
  const email = user?.email || "";
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <Card className={cn("border-none shadow-none", className)}>
      <CardContent className="flex flex-col items-center p-6 text-center">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.user_metadata?.avatar_url} alt={fullName} />
          <AvatarFallback className="text-lg">{initials || role.charAt(0)}</AvatarFallback>
        </Avatar>
        <h3 className="mt-4 text-xl font-bold">{fullName}</h3>
        <p className="text-sm text-muted-foreground capitalize">{role}</p>
        {email && <p className="mt-1 text-xs text-muted-foreground">{email}</p>}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
