import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Calendar, BookOpen, User, Check, X, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useTeacherCourses, 
  useSessionRequests, 
  useTeacherSessions
} from "@/hooks/use-dashboard-data";
import { useToast } from "@/hooks/use-toast";
import { acceptSessionRequest, rejectSessionRequest, startSession } from "@/api/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import AvailabilityScheduler from "@/components/teacher/AvailabilityScheduler";
import SessionRequestSearch from "@/components/teacher/SessionRequestSearch";

// Create a client
const queryClient = new QueryClient();

// Wrapper component to provide React Query context
const TeacherDashboardWithQueryClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TeacherDashboard />
    </QueryClientProvider>
  );
};

const TeacherDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: teacherCourses = [], isLoading: coursesLoading } = useTeacherCourses();
  const { data: sessionRequests = [], isLoading: requestsLoading } = useSessionRequests(searchQuery);
  const { data: teacherSessions = [], isLoading: sessionsLoading } = useTeacherSessions();
  
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    // Update URL when tab changes
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);
  
  // Calculate metrics from sessions data
  const upcomingSessions = teacherSessions.filter(s => 
    s.status === 'scheduled' || s.status === 'in_progress'
  );
  
  const totalSessions = {
    completed: teacherSessions.filter(s => s.status === 'completed').length,
    upcoming: upcomingSessions.length
  };

  const handleAcceptSession = async (sessionId: string) => {
    try {
      await acceptSessionRequest(sessionId);
      toast({
        title: "Session Accepted",
        description: "The session has been scheduled.",
      });
      
      // Invalidate the queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['session_requests'] });
      queryClient.invalidateQueries({ queryKey: ['teacher_sessions'] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error accepting session",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleRejectSession = async (sessionId: string) => {
    try {
      await rejectSessionRequest(sessionId);
      toast({
        title: "Session Rejected",
        description: "The session request has been declined.",
      });
      
      // Invalidate the query to refresh data
      queryClient.invalidateQueries({ queryKey: ['session_requests'] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error rejecting session",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleStartClass = async (sessionId: string) => {
    try {
      const meetingLink = await startSession(sessionId);
      
      // Open the meeting link in a new tab
      if (meetingLink) {
        window.open(meetingLink, '_blank');
        
        // Invalidate the query to refresh data
        queryClient.invalidateQueries({ queryKey: ['teacher_upcoming_sessions'] });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error starting class",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-indian-blue/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-indian-blue" />
                </div>
                <div>
                  <CardTitle>{user?.user_metadata?.first_name || "Teacher"} {user?.user_metadata?.last_name || ""}</CardTitle>
                  <CardDescription>Teacher</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button 
                  variant={activeTab === "overview" ? "default" : "ghost"} 
                  className={activeTab === "overview" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("overview")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "courses" ? "default" : "ghost"} 
                  className={activeTab === "courses" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("courses")}
                >
                  My Courses
                </Button>
                <Button 
                  variant={activeTab === "sessions" ? "default" : "ghost"} 
                  className={activeTab === "sessions" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("sessions")}
                >
                  Session Requests
                </Button>
                <Button 
                  variant={activeTab === "schedule" ? "default" : "ghost"} 
                  className={activeTab === "schedule" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("schedule")}
                >
                  My Schedule
                </Button>
                <Button 
                  variant={activeTab === "availability" ? "default" : "ghost"} 
                  className={activeTab === "availability" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("availability")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Set Availability
                </Button>
                <Button 
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className={activeTab === "profile" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
                  onClick={() => setActiveTab("profile")}
                >
                  <Settings className="h-4 w-4 mr-2" />
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
                      <p className="text-sm font-medium text-muted-foreground mb-1">Session Requests</p>
                      <h3 className="text-2xl font-bold">{sessionRequests.length}</h3>
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
                    <CardTitle>Session Requests</CardTitle>
                    <CardDescription>Pending student session requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {requestsLoading ? (
                      <div className="text-center py-8">Loading session requests...</div>
                    ) : sessionRequests.length > 0 ? (
                      <div className="space-y-4">
                        {sessionRequests.map((request) => (
                          <div key={request.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
                            <div>
                              <h4 className="font-medium">{request.proposed_title}</h4>
                              <p className="text-sm text-muted-foreground">
                                from {request.student?.first_name} {request.student?.last_name} for {request.course?.title}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {new Date(request.proposed_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                                <span className="text-sm">
                                  {new Date(request.proposed_date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })} 
                                  {` (${request.proposed_duration} min)`}
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
                      <p className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No matching session requests found." : "No pending session requests."}
                      </p>
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
                              <p className="text-sm text-muted-foreground">for {session.course?.title}</p>
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
            </TabsContent>
            
            <TabsContent value="courses">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">My Courses</h1>
              <Card>
                <CardContent className="p-6">
                  {coursesLoading ? (
                    <div className="text-center py-8">Loading courses...</div>
                  ) : teacherCourses.length > 0 ? (
                    <div className="space-y-6">
                      {teacherCourses.map((course) => (
                        <div key={course.id} className="flex flex-col p-6 border rounded-lg">
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
                              <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Category</p>
                                  <p className="font-medium">{course.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Lessons</p>
                                  <p className="font-medium">{course.total_lessons}</p>
                                </div>
                              </div>
                              <div className="mt-6 flex justify-end">
                                <Button>Manage Course</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Courses Created</h3>
                      <p className="text-muted-foreground mb-6">You haven't created any courses yet.</p>
                      <Button>Create New Course</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Session Requests</h1>
              <Card>
                <CardContent className="p-6">
                  {/* Add search component */}
                  <SessionRequestSearch onSearch={handleSearch} />
                  
                  {requestsLoading ? (
                    <div className="text-center py-8">Loading session requests...</div>
                  ) : sessionRequests.length > 0 ? (
                    <div className="space-y-6">
                      {sessionRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h3 className="text-lg font-medium">{request.proposed_title}</h3>
                                <p className="text-muted-foreground">
                                  From {request.student?.first_name} {request.student?.last_name}
                                </p>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded">
                                  Pending
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Course</p>
                                <p className="font-medium">{request.course?.title}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Proposed Date</p>
                                <p className="font-medium">
                                  {new Date(request.proposed_date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Proposed Time</p>
                                <p className="font-medium">
                                  {new Date(request.proposed_date).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })} 
                                  {` (${request.proposed_duration} min)`}
                                </p>
                              </div>
                            </div>
                            
                            {request.request_message && (
                              <div>
                                <p className="text-sm text-muted-foreground">Message</p>
                                <p className="bg-muted p-3 rounded mt-1">{request.request_message}</p>
                              </div>
                            )}
                            
                            <div className="flex justify-end gap-4 mt-2">
                              <Button 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleRejectSession(request.id)}
                              >
                                <X className="h-4 w-4 mr-2" /> Decline
                              </Button>
                              <Button 
                                className="bg-indian-green"
                                onClick={() => handleAcceptSession(request.id)}
                              >
                                <Check className="h-4 w-4 mr-2" /> Accept
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Pending Requests</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? "No matching session requests found." : "You don't have any pending session requests."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule">
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
            </TabsContent>

            <TabsContent value="availability">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Set Your Availability</h1>
              <AvailabilityScheduler />
            </TabsContent>
            
            <TabsContent value="profile">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Profile Settings</h1>
              <Card className="mb-8">
                <CardContent className="p-6">
                  <ProfileSettingsForm role="teacher" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardWithQueryClient;
