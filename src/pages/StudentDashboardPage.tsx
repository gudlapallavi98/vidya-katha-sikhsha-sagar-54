
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Calendar, BookOpen, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useStudentEnrollments, 
  useStudentUpcomingSessions, 
  useStudentProgress, 
  useStudentAchievements 
} from "@/hooks/use-dashboard-data";
import { useToast } from "@/hooks/use-toast";
import { joinSession } from "@/api/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

// Wrapper component to provide React Query context
const StudentDashboardWithQueryClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentDashboard />
    </QueryClientProvider>
  );
};

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: enrolledCourses = [], isLoading: coursesLoading } = useStudentEnrollments();
  const { data: progress = [], isLoading: progressLoading } = useStudentProgress();
  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useStudentUpcomingSessions();
  const { data: achievements = [], isLoading: achievementsLoading } = useStudentAchievements();

  // Calculate completed sessions from progress data
  const completedSessions = progress.filter(p => p.completed).length;

  const handleJoinClass = async (sessionId: string) => {
    try {
      if (!user) return;
      
      const meetingLink = await joinSession(sessionId, user.id);
      
      if (meetingLink) {
        window.open(meetingLink, '_blank');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Meeting link not available yet. Try again in a few minutes.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error joining class",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-indian-saffron/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-indian-saffron" />
                </div>
                <div>
                  <CardTitle>{user?.user_metadata?.first_name || "Student"} {user?.user_metadata?.last_name || ""}</CardTitle>
                  <CardDescription>Student</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button 
                  variant={activeTab === "overview" ? "default" : "ghost"} 
                  className={activeTab === "overview" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("overview")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "courses" ? "default" : "ghost"} 
                  className={activeTab === "courses" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("courses")}
                >
                  My Courses
                </Button>
                <Button 
                  variant={activeTab === "sessions" ? "default" : "ghost"} 
                  className={activeTab === "sessions" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("sessions")}
                >
                  Upcoming Sessions
                </Button>
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className={activeTab === "profile" ? "bg-indian-saffron w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview" className="m-0">
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
                      <h3 className="text-2xl font-bold">{upcomingSessions.length}</h3>
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
                      <h3 className="text-2xl font-bold">{completedSessions}</h3>
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
                    ) : upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map((session) => (
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
                                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                  {session.status === "scheduled" ? "Upcoming" : session.status}
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
                      <p className="text-center py-8 text-muted-foreground">
                        You are not enrolled in any courses yet.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="courses">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">My Courses</h1>
              <Card>
                <CardContent className="p-6">
                  {coursesLoading ? (
                    <div className="text-center py-8">Loading courses...</div>
                  ) : enrolledCourses.length > 0 ? (
                    <div className="space-y-6">
                      {enrolledCourses.map((enrollment) => {
                        const course = enrollment.course;
                        const progress = course.total_lessons > 0 
                          ? Math.round((enrollment.completed_lessons / course.total_lessons) * 100)
                          : 0;
                          
                        return (
                          <div key={enrollment.id} className="flex flex-col p-6 border rounded-lg">
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-1/4">
                                <div className="aspect-video rounded-md bg-muted flex items-center justify-center">
                                  {course.image_url ? (
                                    <img 
                                      src={course.image_url} 
                                      alt={course.title} 
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  ) : (
                                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold">{course.title}</h3>
                                <p className="text-muted-foreground mt-2">{course.description}</p>
                                <div className="mt-4 space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Progress</span>
                                    <span className="font-medium">{progress}%</span>
                                  </div>
                                  <div className="w-full bg-background rounded-full h-2">
                                    <div 
                                      className="bg-indian-saffron h-2 rounded-full" 
                                      style={{ width: `${progress}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                  <Button>Continue Learning</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Courses Enrolled</h3>
                      <p className="text-muted-foreground mb-6">You haven't enrolled in any courses yet.</p>
                      <Button>Browse Courses</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Upcoming Sessions</h1>
              <Card>
                <CardContent className="p-6">
                  {sessionsLoading ? (
                    <div className="text-center py-8">Loading sessions...</div>
                  ) : upcomingSessions.length > 0 ? (
                    <div className="space-y-6">
                      {upcomingSessions.map((session) => (
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
                                <div className="w-full md:w-auto px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded text-center">
                                  {session.status === "scheduled" ? "Upcoming" : session.status}
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
            </TabsContent>
            
            <TabsContent value="profile">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Profile Settings</h1>
              <Card>
                <CardContent className="p-6">
                  <p className="text-center py-12 text-muted-foreground">
                    Profile settings will be implemented with Supabase integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardWithQueryClient;
