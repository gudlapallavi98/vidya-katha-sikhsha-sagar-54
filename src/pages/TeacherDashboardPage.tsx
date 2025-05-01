
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Calendar, BookOpen, User, Check, X } from "lucide-react";

// Mock data for teacher's courses and session requests
const teacherCourses = [
  {
    id: 1,
    title: "Mathematics for Class 10",
    students: 25,
    sessionsCompleted: 45,
    nextSession: "Jun 5, 2025, 4:00 PM",
    rating: 4.8,
  },
  {
    id: 2,
    title: "Mathematics for Class 12",
    students: 18,
    sessionsCompleted: 32,
    nextSession: "Jun 6, 2025, 2:00 PM",
    rating: 4.9,
  },
];

const sessionRequests = [
  {
    id: 1,
    studentName: "Rahul Patel",
    courseTitle: "Mathematics for Class 10",
    proposedDate: "Jun 8, 2025",
    proposedTime: "4:00 PM - 5:30 PM",
  },
  {
    id: 2,
    studentName: "Priya Iyer",
    courseTitle: "Mathematics for Class 12",
    proposedDate: "Jun 9, 2025",
    proposedTime: "10:00 AM - 11:30 AM",
  },
  {
    id: 3,
    studentName: "Amit Kumar",
    courseTitle: "Mathematics for Class 10",
    proposedDate: "Jun 10, 2025",
    proposedTime: "3:00 PM - 4:30 PM",
  },
];

const upcomingSessions = [
  {
    id: 1,
    studentName: "Neha Singh",
    courseTitle: "Mathematics for Class 10",
    date: "Jun 5, 2025",
    time: "4:00 PM - 5:30 PM",
    meetingLink: "https://meet.jit.si/class-123-456-789",
  },
  {
    id: 2,
    studentName: "Rajesh Verma",
    courseTitle: "Mathematics for Class 12",
    date: "Jun 6, 2025",
    time: "2:00 PM - 3:30 PM",
    meetingLink: "https://meet.jit.si/class-123-456-790",
  },
];

const TeacherDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleAcceptSession = (sessionId: number) => {
    // This will be implemented with Supabase
    console.log(`Accepting session ${sessionId}`);
  };

  const handleRejectSession = (sessionId: number) => {
    // This will be implemented with Supabase
    console.log(`Rejecting session ${sessionId}`);
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
                  <CardTitle>Dr. Ravi Kumar</CardTitle>
                  <CardDescription>Mathematics Teacher</CardDescription>
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
                  variant={activeTab === "profile" ? "default" : "ghost"} 
                  className={activeTab === "profile" ? "bg-indian-blue w-full justify-start" : "w-full justify-start"}
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
                        {teacherCourses.reduce((sum, course) => sum + course.sessionsCompleted, 0)}
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
                    {sessionRequests.length > 0 ? (
                      <div className="space-y-4">
                        {sessionRequests.map((request) => (
                          <div key={request.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
                            <div>
                              <h4 className="font-medium">{request.courseTitle}</h4>
                              <p className="text-sm text-muted-foreground">with {request.studentName}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{request.proposedDate}</span>
                                <span className="text-sm">{request.proposedTime}</span>
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
                        No pending session requests.
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
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                          <div key={session.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
                            <div>
                              <h4 className="font-medium">{session.courseTitle}</h4>
                              <p className="text-sm text-muted-foreground">with {session.studentName}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{session.date}</span>
                                <span className="text-sm">{session.time}</span>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <Button size="sm" className="bg-indian-blue">
                                Start Class
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
                  <p className="text-center py-12 text-muted-foreground">
                    Detailed course content will be implemented with Supabase integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Session Requests</h1>
              <Card>
                <CardContent className="p-6">
                  <p className="text-center py-12 text-muted-foreground">
                    Full session management will be implemented with Supabase integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="schedule">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">My Schedule</h1>
              <Card>
                <CardContent className="p-6">
                  <p className="text-center py-12 text-muted-foreground">
                    Schedule management will be implemented with a calendar interface connected to Supabase.
                  </p>
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

export default TeacherDashboardPage;
