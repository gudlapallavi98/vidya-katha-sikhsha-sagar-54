
import React from "react";
import { Calendar, Clock, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isAfter, isBefore, addMinutes, subMinutes } from "date-fns";

export interface TeacherScheduleProps {
  teacherSessions: any[];
  upcomingSessions: any[];
  sessionsLoading: boolean;
  handleStartClass: (sessionId: string) => Promise<void>;
}

const TeacherSchedule: React.FC<TeacherScheduleProps> = ({
  teacherSessions,
  upcomingSessions,
  sessionsLoading,
  handleStartClass,
}) => {
  if (sessionsLoading) {
    return (
      <div className="p-4">
        <div className="h-[200px] flex items-center justify-center">
          <p>Loading schedule...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canStartSession = (session: any) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    
    // Can start 15 minutes before and up to 5 minutes after start time
    const canStartTime = subMinutes(sessionStart, 15);
    const lateStartTime = addMinutes(sessionStart, 5);
    
    return isAfter(now, canStartTime) && isBefore(now, lateStartTime) && session.status === 'scheduled';
  };

  const canJoinSession = (session: any) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    
    return session.status === 'in_progress' && 
           isAfter(now, sessionStart) && 
           isBefore(now, sessionEnd) && 
           session.meeting_link;
  };

  const getSessionStatus = (session: any) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    
    if (session.status === 'completed') return 'Completed';
    if (session.status === 'cancelled') return 'Cancelled';
    if (session.status === 'in_progress') return 'Live Now';
    
    if (isBefore(now, sessionStart)) {
      const timeDiff = sessionStart.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      const hoursDiff = Math.floor(minutesDiff / 60);
      
      if (hoursDiff > 0) {
        return `Starts in ${hoursDiff}h ${minutesDiff % 60}m`;
      } else {
        return `Starts in ${minutesDiff}m`;
      }
    }
    
    if (isAfter(now, sessionEnd)) return 'Ended';
    
    return 'Scheduled';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">My Schedule</h2>
        <p className="text-muted-foreground">View and manage your upcoming sessions</p>
      </div>

      <div className="grid gap-4">
        {upcomingSessions.length > 0 ? (
          upcomingSessions.map((session) => (
            <Card key={session.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {session.course?.title || 'Individual Session'}
                    </p>
                  </div>
                  <Badge className={getStatusColor(session.status)}>
                    {getSessionStatus(session)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(session.start_time), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(session.start_time), 'hh:mm a')} - {format(new Date(session.end_time), 'hh:mm a')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">1 student</span>
                  </div>
                </div>
                
                {session.description && (
                  <p className="text-sm text-muted-foreground mt-3">
                    {session.description}
                  </p>
                )}
                
                <div className="flex gap-2 mt-4">
                  {canStartSession(session) && (
                    <Button 
                      onClick={() => handleStartClass(session.id)}
                      className="flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Start Class
                    </Button>
                  )}
                  {canJoinSession(session) && (
                    <Button 
                      variant="outline"
                      onClick={() => window.open(session.meeting_link, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Join Meeting
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
              <p className="text-muted-foreground text-center">
                You don't have any scheduled sessions at the moment.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherSchedule;
