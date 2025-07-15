import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Video, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Session } from "@/hooks/types";
import { format, isAfter, isBefore, subMinutes } from "date-fns";
import { SessionJoinButton } from "@/components/student/session/SessionJoinButton";
import SessionHistory from "@/components/shared/SessionHistory";

interface SessionsTabProps {
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const SessionsTab: React.FC<SessionsTabProps> = ({
  upcomingSessions,
  sessionsLoading,
  handleJoinClass,
}) => {
  const navigate = useNavigate();
  const [showHistory, setShowHistory] = useState(false);

  // Filter sessions to ensure they are truly upcoming and current date forward
  const filteredSessions = upcomingSessions.filter(session => {
    const now = new Date();
    const sessionEnd = new Date(session.end_time);
    
    // Only show sessions that haven't ended yet
    const isUpcoming = sessionEnd >= now && 
                      (session.status === 'scheduled' || session.status === 'in_progress');
    
    console.log("Filtering session:", {
      sessionId: session.id,
      title: session.title,
      startTime: session.start_time,
      endTime: session.end_time,
      status: session.status,
      isUpcoming,
      now: now.toISOString(),
      sessionEnd: sessionEnd.toISOString()
    });
    
    return isUpcoming;
  });

  const getSessionStatus = (session: Session) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    
    console.log("Getting session status:", {
      sessionId: session.id,
      status: session.status,
      sessionStart: sessionStart.toISOString(),
      sessionEnd: sessionEnd.toISOString(),
      now: now.toISOString()
    });
    
    if (session.status === 'completed') return { label: 'Completed', variant: 'secondary' as const };
    if (session.status === 'cancelled') return { label: 'Cancelled', variant: 'destructive' as const };
    
    if (session.status === 'in_progress') {
      return { label: 'Live Now', variant: 'default' as const };
    }
    
    if (isBefore(now, sessionStart)) {
      const timeDiff = sessionStart.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      const hoursDiff = Math.floor(minutesDiff / 60);
      const daysDiff = Math.floor(hoursDiff / 24);
      
      if (daysDiff > 0) {
        return { label: `Starts in ${daysDiff} day${daysDiff > 1 ? 's' : ''}`, variant: 'outline' as const };
      } else if (hoursDiff > 0) {
        return { label: `Starts in ${hoursDiff}h ${minutesDiff % 60}m`, variant: 'outline' as const };
      } else if (minutesDiff > 0) {
        return { label: `Starts in ${minutesDiff}m`, variant: 'outline' as const };
      } else {
        return { label: 'Starting Soon', variant: 'default' as const };
      }
    }
    
    if (isAfter(now, sessionEnd)) {
      return { label: 'Ended', variant: 'secondary' as const };
    }
    
    return { label: 'Scheduled', variant: 'outline' as const };
  };

  const formatSessionDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      console.log("Formatting session date:", { original: dateString, parsed: date });
      return format(date, 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error formatting session date:", error, { dateString });
      return dateString;
    }
  };

  const formatSessionTime = (startTime: string, endTime: string) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
    } catch (error) {
      console.error("Error formatting session time:", error, { startTime, endTime });
      return `${startTime} - ${endTime}`;
    }
  };

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <DashboardHeader heading="Upcoming Sessions" />
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
            <SessionHistory userType="student" />
          </DialogContent>
        </Dialog>
      </div>
      
      <DashboardCard isLoading={sessionsLoading}>
        {filteredSessions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => {
                const status = getSessionStatus(session);
                
                console.log("Rendering session:", {
                  sessionId: session.id,
                  title: session.title,
                  startTime: session.start_time,
                  endTime: session.end_time,
                  status: status.label
                });
                
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.title}</TableCell>
                    <TableCell>{session.course?.title || 'Individual Session'}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {formatSessionDate(session.start_time)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatSessionTime(session.start_time, session.end_time)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <SessionJoinButton
                        sessionStartTime={session.start_time}
                        sessionEndTime={session.end_time}
                        meetingLink={session.meeting_link}
                        onJoin={() => handleJoinClass(session.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
            <Calendar className="h-16 w-16 text-muted-foreground/60" />
            <h3 className="text-xl font-medium">No Upcoming Sessions</h3>
            <p className="text-sm text-muted-foreground">You don't have any upcoming sessions scheduled</p>
            <Button onClick={() => navigate('/student-dashboard?tab=request-session')} className="mt-4">
              Request a Session
            </Button>
          </div>
        )}
      </DashboardCard>
    </DashboardShell>
  );
};

export default SessionsTab;
