
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface TeacherProfileCardProps {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  experience?: string;
  avatarUrl?: string;
  subjects?: string[];
  onBookSession: (teacherId: string) => void;
}

const TeacherProfileCard: React.FC<TeacherProfileCardProps> = ({
  id,
  firstName,
  lastName,
  bio,
  experience,
  avatarUrl,
  subjects,
  onBookSession,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
          ) : (
            <AvatarFallback>
              <User className="h-10 w-10" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <CardTitle>{firstName} {lastName}</CardTitle>
          <CardDescription>Teacher</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {subjects && subjects.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Subjects</h4>
            <div className="flex flex-wrap gap-1">
              {subjects.map((subject, index) => (
                <span 
                  key={index}
                  className="bg-muted text-xs px-2 py-1 rounded"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {experience && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-1">Experience</h4>
            <p className="text-sm text-muted-foreground">
              {experience.length > 150 ? `${experience.substring(0, 150)}...` : experience}
            </p>
          </div>
        )}
        
        {bio && (
          <div className="mb-4 flex-1">
            <h4 className="text-sm font-medium mb-1">Bio</h4>
            <p className="text-sm text-muted-foreground">
              {bio.length > 200 ? `${bio.substring(0, 200)}...` : bio}
            </p>
          </div>
        )}
        
        <Button 
          onClick={() => onBookSession(id)} 
          className="mt-auto w-full"
        >
          Book Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeacherProfileCard;
