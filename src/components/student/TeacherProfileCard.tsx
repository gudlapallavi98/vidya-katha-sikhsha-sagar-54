
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Star } from "lucide-react";

interface TeacherProfileCardProps {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  experience?: string;
  avatarUrl?: string;
  subjects?: string[];
  city?: string;
  country?: string;
  price?: number;
  sessionType?: string;
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
  city,
  country,
  price,
  sessionType,
  onBookSession,
}) => {
  const location = [city, country].filter(Boolean).join(', ');

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
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
        <div className="flex-1">
          <CardTitle className="text-lg">{firstName} {lastName}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            Teacher
          </CardDescription>
          {location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {location}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {subjects && subjects.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Subjects</h4>
            <div className="flex flex-wrap gap-1">
              {subjects.slice(0, 3).map((subject, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {subject}
                </Badge>
              ))}
              {subjects.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{subjects.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {experience && (
          <div>
            <h4 className="text-sm font-medium mb-1">Experience</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {experience.length > 120 ? `${experience.substring(0, 120)}...` : experience}
            </p>
          </div>
        )}
        
        {bio && (
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-1">About</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {bio.length > 150 ? `${bio.substring(0, 150)}...` : bio}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-col">
            {price && (
              <span className="font-bold text-lg text-primary">
                ₹{price}
              </span>
            )}
            {sessionType && (
              <span className="text-xs text-muted-foreground capitalize">
                {sessionType} session
              </span>
            )}
          </div>
          <Button 
            onClick={() => onBookSession(id)} 
            className="flex-shrink-0"
          >
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherProfileCard;
