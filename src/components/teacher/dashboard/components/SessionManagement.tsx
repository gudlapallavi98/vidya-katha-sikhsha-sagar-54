
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, Clock } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Session } from "@/hooks/types";
import { format, isAfter, isBefore, subMinutes } from "date-fns";

interface SessionManagementProps {
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  handleStartClass: (sessionId: string) => Promise<void>;
}

const SessionManagement: React.FC<SessionManagementProps> = ({
  upcomingSessions,
  sessionsLoading,
  handleStartClass,
}) => {
  const canStartSession = (session: Session) => {
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
    
    // Can start 15 minutes before the scheduled start time
    const canStartTime = subMinutes(sessionStart, 15);
    
    const isAfterCanStartTime = isAfter(now, canStartTime);
    const isBeforeSessionEnd = isBefore(now, sessionEnd);
    const statusIsScheduled = session.status === 'scheduled';
    
    // Only allow starting if:
    // 1. Session is scheduled (not completed/cancelled)
    // 2. Current time is at least 15 minutes before start time
    // 3. Current time is before session end time
    const canStart = statusIsScheduled && isAfterCanStartTime && isBeforeSessionEnd;
    
    console.log("Can start session result:", {
      canStartTime: canStartTime.toISOString(),
      isAfterCanStartTime,
      isBeforeSessionEnd,
      statusIsScheduled,
      canStart
    });
    
    return canStart;
  };

  const getSessionStatus = (session: Session) => {
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
    
    if (session.status === 'completed') return { label: 'Completed', variant: 'secondary' as const };
    if (session.status === 'cancelled') return { label: 'Cancelled', variant: 'destructive' as const };
    
    if (session.status === 'in_progress') {
      return { label: 'Live Now', variant: 'default' as const };
    }
    
    if (isBefore(now, sessionStart)) {
      const timeDiff = sessionStart.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      const hoursDiff = Math.floor(minutesDiff / 60);
      
      if (hoursDiff > 0) {
        return { label: `Starts in ${hoursDiff}h ${minutesDiff % 60}m`, variant: 'outline' as const };
      } else if (minutesDiff > 15) {
        return { label: `Starts in ${minutesDiff}m`, variant: 'outline' as const };
      } else if (minutesDiff > 0) {
        return { label: 'Starting Soon', variant: 'default' as const };
      } else {
        return { label: 'Starting Now', variant: 'default' as const };
      }
    }
    
    if (isAfter(now, sessionEnd)) {
      return { label: 'Ended', variant: 'secondary' as const };
    }
    
    return { label: 'Scheduled', variant: 'outline' as const };
  };

  const formatSessionDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatSessionTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${format(start, 'hh:mm a')} - ${format(end, 'hh:mm a')}`;
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Upcoming Sessions" />
      
      <DashboardCard isLoading={sessionsLoading}>
        {upcomingSessions.length > 0 ? (
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
              {upcomingSessions.map((session) => {
                const status = getSessionStatus(session);
                const canStart = canStartSession(session);
                
                console.log("Rendering session with timing check:", {
                  sessionId: session.id,
                  title: session.title,
                  startTime: session.start_time,
                  canStart,
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
                      {canStart ? (
                        <Button size="sm" onClick={() => handleStartClass(session.id)} className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Start Class
                        </Button>
                      ) : (
                        <Button size="sm" disabled className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Wait
                        </Button>
                      )}
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
          </div>
        )}
      </DashboardCard>
    </DashboardShell>
  );
};

export default SessionManagement;
