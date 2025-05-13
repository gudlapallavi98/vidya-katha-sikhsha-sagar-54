
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/hooks/types";

interface RecentSessionsListProps {
  sessions: Session[];
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (session: Session) => string;
}

const RecentSessionsList: React.FC<RecentSessionsListProps> = ({
  sessions,
  getStatusBadgeClass,
  getStatusText
}) => {
  if (sessions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Past Sessions</CardTitle>
        <CardDescription>Your completed or missed sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-muted-foreground">from {session.course?.title || "Unknown Course"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm">
                    {new Date(session.start_time).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className={`px-2 py-1 ${getStatusBadgeClass(session.display_status || '')} text-xs font-medium rounded`}>
                  {getStatusText(session)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSessionsList;
