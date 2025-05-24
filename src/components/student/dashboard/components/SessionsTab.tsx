
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Session } from "@/hooks/types";

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
              {upcomingSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.title}</TableCell>
                  <TableCell>{session.course?.title}</TableCell>
                  <TableCell>
                    {new Date(session.start_time).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })} at {new Date(session.start_time).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={session.status === "in_progress" ? "default" : "outline"}>
                      {session.status === "in_progress" ? "Live Now" : 
                       session.status === "scheduled" ? "Upcoming" : session.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {session.status === "in_progress" && (
                      <Button size="sm" onClick={() => handleJoinClass(session.id)}>
                        Join Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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
