
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Session } from "@/hooks/types";

interface StudentUpcomingSessionsProps {
  sessions: Session[];
  sessionsLoading: boolean;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (session: Session) => string;
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const StudentUpcomingSessions: React.FC<StudentUpcomingSessionsProps> = ({
  sessions,
  sessionsLoading,
  getStatusBadgeClass,
  getStatusText,
  handleJoinClass
}) => {
  return (
    <>
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Upcoming Sessions</h1>
      <Card>
        <CardContent className="p-6">
          {sessionsLoading ? (
            <div className="text-center py-8">Loading sessions...</div>
          ) : sessions.length > 0 ? (
            <div className="space-y-6">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-medium">{session.title}</h3>
                      <p className="text-muted-foreground mt-1">{session.course?.title || "Unknown Course"}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {new Date(session.start_time).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="text-sm text-muted-foreground ml-6">
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
                      {session.description && (
                        <p className="mt-3 text-sm">{session.description}</p>
                      )}
                    </div>
                    
                    <div className="w-full md:w-auto">
                      {session.status === "in_progress" && session.meeting_link ? (
                        <Button 
                          className="w-full md:w-auto bg-indian-green"
                          onClick={() => handleJoinClass(session.id)}
                        >
                          Join Session
                        </Button>
                      ) : (
                        <div className={`w-full md:w-auto px-3 py-1 ${getStatusBadgeClass(session.status)} text-sm font-medium rounded text-center`}>
                          {getStatusText(session)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Upcoming Sessions</h3>
              <p className="text-muted-foreground mb-6">You don't have any upcoming sessions scheduled.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default StudentUpcomingSessions;
