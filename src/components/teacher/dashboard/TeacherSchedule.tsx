import React, { useState } from "react";
import { Calendar, Clock, Users, Video, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format, isAfter, isBefore, addMinutes, subMinutes } from "date-fns";
import SessionHistory from "@/components/shared/SessionHistory";

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
  const [showHistory, setShowHistory] = useState(false);

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
    
    console.log("Checking if can start session:", {
      sessionId: session.id,
      now: now.toISOString(),
      sessionStart: sessionStart.toISOString(),
      sessionEnd: sessionEnd.toISOString(),
      status: session.status
    });
    
    // Can start on the scheduled date and time (allow starting from exact time)
    // Allow starting up to 15 minutes before and during the session
    const canStartTime = subMinutes(sessionStart, 15);
    
    const canStart = isAfter(now, canStartTime) && 
                    isBefore(now, sessionEnd) && 
                    session.status === 'scheduled';
    
    console.log("Can start session result:", {
      canStartTime: canStartTime.toISOString(),
      isAfterCanStartTime: isAfter(now, canStartTime),
      isBeforeSessionEnd: isBefore(now, sessionEnd),
      statusIsScheduled: session.status === 'scheduled',
      canStart
    });
    
    return canStart;
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
    
    console.log("Getting session status:", {
      sessionId: session.id,
      now: now.toISOString(),
      sessionStart: sessionStart.toISOString(),
      sessionEnd: sessionEnd.toISOString(),
      status: session.status
    });
    
    if (session.status === 'completed') return 'Completed';
    if (session.status === 'cancelled') return 'Cancelled';
    if (session.status === 'in_progress') return 'Live Now';
    
    // Check if session has ended
    if (isAfter(now, sessionEnd)) {
      return 'Ended';
    }
    
    // Check timing for scheduled sessions
    if (session.status === 'scheduled') {
      const canStartTime = subMinutes(sessionStart, 15);
      
      // If we're within the start window
      if (isAfter(now, canStartTime) && isBefore(now, sessionEnd)) {
        if (isAfter(now, sessionStart)) {
          return 'Ready to Start';
        } else {
          const minutesToStart = Math.floor((sessionStart.getTime() - now.getTime()) / (1000 * 60));
          return `Starts in ${minutesToStart}m`;
        }
      }
      
      // If session is in the future
      if (isBefore(now, canStartTime)) {
        const timeDiff = sessionStart.getTime() - now.getTime();
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const hoursDiff = Math.floor(minutesDiff / 60);
        
        if (hoursDiff > 0) {
          return `Starts in ${hoursDiff}h ${minutesDiff % 60}m`;
        } else if (minutesDiff > 0) {
          return `Starts in ${minutesDiff}m`;
        } else {
          return 'Starting Soon';
        }
      }
    }
    
    return 'Scheduled';
  };

  // Filter to only show truly upcoming sessions (not ended)
  const filteredUpcomingSessions = upcomingSessions.filter(session => {
    const now = new Date();
    const sessionEnd = new Date(session.end_time);
    const isUpcoming = isAfter(sessionEnd, now);
    
    console.log("Filtering session:", {
      sessionId: session.id,
      title: session.title,
      sessionEnd: sessionEnd.toISOString(),
      now: now.toISOString(),
      isUpcoming
    });
    
    return isUpcoming;
  });

  console.log("Filtered upcoming sessions:", filteredUpcomingSessions.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Schedule</h2>
          <p className="text-muted-foreground">View and manage your upcoming sessions</p>
        </div>
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              View History
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Session History</DialogTitle>
            </DialogHeader>
            <SessionHistory userType="teacher" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredUpcomingSessions.length > 0 ? (
          filteredUpcomingSessions.map((session) => {
            const canStart = canStartSession(session);
            const canJoin = canJoinSession(session);
            const statusText = getSessionStatus(session);
            
            return (
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
                      {statusText}
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
                    {canStart && (
                      <Button 
                        onClick={() => handleStartClass(session.id)}
                        className="flex items-center gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Start Class
                      </Button>
                    )}
                    {canJoin && (
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
            );
          })
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
