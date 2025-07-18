
import React from "react";
import { BookOpen, Calendar, Video, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Session, SessionRequest } from "@/hooks/types";
import { format } from "date-fns";

interface TeacherOverviewProps {
  teacherCourses: any[];
  coursesLoading: boolean;
  sessionRequests: SessionRequest[];
  requestsLoading: boolean;
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  totalSessions: {
    completed: number;
    upcoming: number;
  };
  handleAcceptSession: (sessionId: string) => Promise<void>;
  handleRejectSession: (sessionId: string) => Promise<void>;
  handleStartClass: (sessionId: string) => Promise<void>;
}

const TeacherOverview: React.FC<TeacherOverviewProps> = ({
  teacherCourses,
  coursesLoading,
  sessionRequests,
  requestsLoading,
  upcomingSessions,
  sessionsLoading,
  totalSessions,
  handleAcceptSession,
  handleRejectSession,
  handleStartClass,
}) => {
  // Filter to only show pending requests in overview
  const pendingRequests = sessionRequests.filter(request => request.status === 'pending');
  
  // Format the proposed date properly for overview
  const formatRequestDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      console.log("TeacherOverview - Formatting request date:", { dateString, parsedDate: date });
      return format(date, 'MMM dd, yyyy') + ' at ' + format(date, 'h:mm a');
    } catch (error) {
      console.error("Error formatting request date:", error, { dateString });
      return dateString;
    }
  };

  return (
    <>
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Teacher Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indian-blue/10 to-indian-blue/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Courses</p>
              <h3 className="text-2xl font-bold">{teacherCourses.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-blue/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indian-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indian-saffron/10 to-indian-saffron/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Requests</p>
              <h3 className="text-2xl font-bold">{pendingRequests.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-saffron/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-indian-saffron" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indian-green/10 to-indian-green/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Sessions</p>
              <h3 className="text-2xl font-bold">
                {totalSessions.completed}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-green/20 flex items-center justify-center">
              <Video className="h-6 w-6 text-indian-green" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Session Requests</CardTitle>
            <CardDescription>Student session requests waiting for your response</CardDescription>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="text-center py-8">Loading session requests...</div>
            ) : pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">{request.proposed_title}</h4>
                      <p className="text-sm text-muted-foreground">
                        from {request.student?.first_name} {request.student?.last_name} {request.course?.title && `for ${request.course.title}`}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatRequestDate(request.proposed_date)}
                        </span>
                        <span className="text-sm">
                          ({request.proposed_duration} min)
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="bg-indian-green" 
                        onClick={() => handleAcceptSession(request.id)}
                      >
                        <Check className="h-4 w-4 mr-1" /> Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleRejectSession(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" /> Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No pending session requests.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled tutoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="text-center py-8">Loading upcoming sessions...</div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-sm text-muted-foreground">{session.course?.title && `for ${session.course.title}`}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {format(new Date(session.start_time), 'MMM dd, yyyy')} at {format(new Date(session.start_time), 'h:mm a')} - {format(new Date(session.end_time), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button 
                        size="sm" 
                        className="bg-indian-blue"
                        onClick={() => handleStartClass(session.id)}
                      >
                        {session.status === "in_progress" ? "Join Class" : "Start Class"}
                      </Button>
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
      </div>
    </>
  );
};

export default TeacherOverview;
