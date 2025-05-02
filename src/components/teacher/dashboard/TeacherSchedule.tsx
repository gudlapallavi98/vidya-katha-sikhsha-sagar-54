
import React from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Session } from "@/hooks/types";

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
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-indian-blue"></span>
                          <h3 className="font-medium">{session.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.course?.title}
                        </p>
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
                      <div className="mt-3 md:mt-0">
                        <Button 
                          size="sm" 
                          className="bg-indian-blue"
                          onClick={() => handleStartClass(session.id)}
                        >
                          {session.status === "in_progress" ? "Join Class" : "Start Class"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
