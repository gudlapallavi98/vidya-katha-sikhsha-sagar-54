
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Enrollment, Session } from "@/hooks/types";
import { useNavigate } from "react-router-dom";

interface StudentDashboardOverviewProps {
  enrolledCourses: Enrollment[];
  upcomingSessionsList: Session[];
  completedSessionsList: Session[];
  coursesLoading: boolean;
  sessionsLoading: boolean;
  getStatusBadgeClass: (status: string) => string;
  getStatusText: (session: Session) => string;
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const StudentDashboardOverview: React.FC<StudentDashboardOverviewProps> = ({
  enrolledCourses,
  upcomingSessionsList,
  completedSessionsList,
  coursesLoading,
  sessionsLoading,
  getStatusBadgeClass,
  getStatusText,
  handleJoinClass
}) => {
  const navigate = useNavigate();

  const handleNavigateToCourses = () => {
    navigate('/courses');
  };

  return (
    <>
      <h1 className="font-sanskrit text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-indian-saffron/10 to-indian-saffron/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Enrolled Courses</p>
              <h3 className="text-2xl font-bold">{enrolledCourses.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-saffron/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-indian-saffron" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indian-green/10 to-indian-green/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Upcoming Sessions</p>
              <h3 className="text-2xl font-bold">{upcomingSessionsList.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-green/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-indian-green" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-indian-blue/10 to-indian-blue/5">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Completed Sessions</p>
              <h3 className="text-2xl font-bold">{completedSessionsList.length}</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-indian-blue/20 flex items-center justify-center">
              <Video className="h-6 w-6 text-indian-blue" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled tutoring sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="text-center py-8">Loading sessions...</div>
            ) : upcomingSessionsList.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessionsList.map((session) => (
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
        
        {completedSessionsList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Past Sessions</CardTitle>
              <CardDescription>Your completed or missed sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedSessionsList.map((session) => (
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
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Your enrolled courses</CardDescription>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="text-center py-8">Loading courses...</div>
            ) : enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.map((enrollment) => {
                  const course = enrollment.course;
                  const progress = course.total_lessons > 0 
                    ? Math.round((enrollment.completed_lessons / course.total_lessons) * 100)
                    : 0;
                    
                  return (
                    <div key={enrollment.id} className="flex flex-col p-4 bg-muted rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          Last accessed: {
                            new Date(enrollment.last_accessed_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })
                          }
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {course.description.substring(0, 100)}
                        {course.description.length > 100 ? '...' : ''}
                      </p>
                      <div className="w-full bg-background rounded-full h-2.5 mb-2">
                        <div 
                          className="bg-indian-saffron h-2.5 rounded-full" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{progress}% completed</span>
                        <Button variant="ghost" size="sm" className="text-indian-saffron">
                          Continue Learning
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">You are not enrolled in any courses yet.</p>
                <Button onClick={handleNavigateToCourses}>Browse Courses</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StudentDashboardOverview;
