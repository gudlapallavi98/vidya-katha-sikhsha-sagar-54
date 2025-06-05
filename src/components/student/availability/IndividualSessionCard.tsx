
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, BookOpen, IndianRupee } from "lucide-react";
import { format } from "date-fns";

interface IndividualSessionCardProps {
  slot: any;
  onSelectSlot: (slot: any) => void;
}

export const IndividualSessionCard: React.FC<IndividualSessionCardProps> = ({
  slot,
  onSelectSlot,
}) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBookSession = () => {
    console.log("Individual session selected:", slot);
    onSelectSlot(slot);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              {slot.subject?.name || "Subject"}
            </CardTitle>
            <Badge variant="outline" className="mt-1">
              Individual Session
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 flex items-center">
              <IndianRupee className="h-5 w-5" />
              {slot.price || slot.teacher_rate || 100}
            </div>
            <p className="text-sm text-gray-500">per session</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{format(new Date(slot.available_date), "MMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>
              {slot.booked_students || 0}/{slot.max_students || 1} students
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant={slot.status === "available" ? "default" : "secondary"}
              className="text-xs"
            >
              {slot.status}
            </Badge>
          </div>
        </div>
        {slot.notes && (
          <p className="text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded">
            {slot.notes}
          </p>
        )}
        <Button 
          className="w-full mt-4" 
          onClick={handleBookSession}
          type="button"
        >
          Book This Session
        </Button>
      </CardContent>
    </Card>
  );
};
