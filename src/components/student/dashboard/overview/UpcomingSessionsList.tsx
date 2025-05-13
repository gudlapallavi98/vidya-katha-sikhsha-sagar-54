
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Session } from "@/hooks/types";

interface UpcomingSessionsListProps {
  sessions: Session[];
  isLoading: boolean;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (session: Session) => string;
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const UpcomingSessionsList: React.FC<UpcomingSessionsListProps> = ({
  sessions,
  isLoading,
  getStatusBadgeClass,
  getStatusText,
  handleJoinClass
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your scheduled tutoring sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading sessions...</div>
        ) : sessions.length > 0 ? (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
                <div>
                  <h4 className="font-medium">{session.title}</h4>
                  <p className="text-sm text-muted-foreground">from {session.course?.title || "Unknown Course"}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(session.start_time).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-sm">
                      {new Date(session.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })} - 
                      {new Date(session.end_time).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2">
                  {session.status === "in_progress" && session.meeting_link ? (
                    <Button 
                      size="sm" 
                      className="bg-indian-green"
                      onClick={() => handleJoinClass(session.id)}
                    >
                      Join Class
                    </Button>
                  ) : (
                    <div className={`px-2 py-1 ${getStatusBadgeClass(session.status)} text-xs font-medium rounded`}>
                      {getStatusText(session)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No upcoming sessions scheduled.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsList;
