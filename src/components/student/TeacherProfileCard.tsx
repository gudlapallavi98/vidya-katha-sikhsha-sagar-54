
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeacherProfileCardProps {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  experience?: string;
  avatarUrl?: string;
  subjects?: string[];
  availableDate?: string;
  availableTime?: string;
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
  availableDate,
  availableTime,
  onBookSession,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
          ) : (
            <AvatarFallback className="bg-muted">
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
        
        {availableDate && availableTime && (
          <div className="mb-4 p-3 bg-muted/50 rounded-md border border-muted">
            <h4 className="text-sm font-medium mb-2">Next Available</h4>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{availableDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{availableTime}</span>
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
          className={cn("mt-auto w-full", 
            !availableDate ? "bg-muted text-muted-foreground hover:bg-muted/80" : ""
          )}
        >
          Book Session
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeacherProfileCard;
