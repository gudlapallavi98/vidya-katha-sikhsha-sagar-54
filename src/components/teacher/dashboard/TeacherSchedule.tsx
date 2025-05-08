
import React, { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Session } from "@/hooks/types";
import { useToast } from "@/hooks/use-toast";

interface TeacherScheduleProps {
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  handleStartClass: (sessionId: string) => Promise<void>;
}

const TeacherSchedule: React.FC<TeacherScheduleProps> = ({
  upcomingSessions,
  sessionsLoading,
  handleStartClass,
}) => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute for accurate session status
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleJoinClass = async (session: Session) => {
    const sessionStartTime = new Date(session.start_time);
    const sessionEndTime = new Date(session.end_time);
    
    // Check if session is scheduled for the future
    if (currentTime < sessionStartTime) {
      const options: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        month: 'short',
        day: 'numeric'
      };
      
      toast({
        title: "Session Not Started Yet",
        description: `This class is scheduled to start at ${sessionStartTime.toLocaleTimeString(undefined, options)} on ${sessionStartTime.toLocaleDateString()}. Please join at the scheduled time.`,
        variant: "default"
      });
      return;
    }
    
    // Check if session has already ended
    if (currentTime > sessionEndTime) {
      toast({
        title: "Session Expired",
        description: "This class has already ended. You can no longer join this session.",
        variant: "destructive"
      });
      return;
    }
    
    // If within session time, proceed to join
    try {
      await handleStartClass(session.id);
    } catch (error) {
      console.error("Error joining class:", error);
      toast({
        title: "Error",
        description: "There was a problem joining the class. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate if session is currently active (between start and end times)
  const isSessionActive = (session: Session) => {
    const now = currentTime;
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time);
    return now >= startTime && now <= endTime;
  };
  
  // Check if session has already ended
  const isSessionPast = (session: Session) => {
    const now = currentTime;
    const endTime = new Date(session.end_time);
    return now > endTime;
  };
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <h1 className="font-sanskrit text-3xl font-bold mb-6">My Schedule</h1>
      <Card>
        <CardContent className="p-6">
          {sessionsLoading ? (
            <div className="text-center py-8">Loading schedule...</div>
          ) : upcomingSessions.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {upcomingSessions.map((session) => {
                  const isActive = isSessionActive(session);
                  const isPast = isSessionPast(session);
                  
                  return (
                    <div 
                      key={session.id} 
                      className={`border rounded-lg p-4 ${isPast ? 'opacity-70' : ''}`}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : isPast ? 'bg-gray-400' : 'bg-indian-blue'}`}></span>
                            <h3 className="font-medium">{session.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {session.course?.title}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {formatDate(session.start_time)}
                            </span>
                            <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                            <span className="text-sm">
                              {formatTime(session.start_time)} - {formatTime(session.end_time)}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className={`text-xs ${isActive ? 'text-green-600 font-medium' : isPast ? 'text-gray-500' : 'text-blue-600'}`}>
                              Status: {isPast ? "Completed" : isActive ? "In Progress" : "Upcoming"}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0">
                          <Button 
                            size="sm" 
                            className={`${isActive ? 'bg-green-500 hover:bg-green-600' : isPast ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' : 'bg-indian-blue'}`}
                            onClick={() => handleJoinClass(session)}
                            disabled={isPast}
                          >
                            {isActive ? "Join Class Now" : isPast ? "Class Ended" : "Start Class"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Scheduled Sessions</h3>
              <p className="text-muted-foreground">You don't have any upcoming sessions.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TeacherSchedule;
