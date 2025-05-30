
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Session } from "@/hooks/types";
import { format, isAfter, isBefore, addMinutes, subMinutes } from "date-fns";

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

  const canJoinSession = (session: Session) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    
    // Can join 5 minutes before start time and during the session
    const canJoinTime = subMinutes(sessionStart, 5);
    
    return (session.status === 'in_progress' || session.status === 'scheduled') && 
           isAfter(now, canJoinTime) && 
           isBefore(now, sessionEnd);
  };

  const getSessionStatus = (session: Session) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    
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
                const canJoin = canJoinSession(session);
                
                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.title}</TableCell>
                    <TableCell>{session.course?.title || 'Individual Session'}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {format(new Date(session.start_time), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(session.start_time), 'hh:mm a')} - {format(new Date(session.end_time), 'hh:mm a')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {canJoin && (
                        <Button size="sm" onClick={() => handleJoinClass(session.id)} className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Join Now
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
