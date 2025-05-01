
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Video, Calendar, BookOpen, User } from "lucide-react";

// Mock data for enrolled courses and upcoming sessions
const enrolledCourses = [
  {
    id: 1,
    title: "Mathematics for Class 10",
    progress: 60,
    nextLesson: "Quadratic Equations",
    teacherName: "Dr. Ravi Kumar",
    lastAccessed: "2 days ago",
  },
  {
    id: 2,
    title: "Advanced Java Programming",
    progress: 25,
    nextLesson: "Object-Oriented Programming",
    teacherName: "Prof. Anita Sharma",
    lastAccessed: "5 days ago",
  },
];

const upcomingSessions = [
  {
    id: 1,
    courseTitle: "Mathematics for Class 10",
    teacherName: "Dr. Ravi Kumar",
    date: "Jun 5, 2025",
    time: "4:00 PM - 5:30 PM",
    status: "confirmed",
    meetingLink: "https://meet.jit.si/class-123-456-789",
  },
  {
    id: 2,
    courseTitle: "Advanced Java Programming",
    teacherName: "Prof. Anita Sharma",
    date: "Jun 7, 2025",
    time: "10:00 AM - 11:30 AM",
    status: "pending",
    meetingLink: null,
  },
];

const StudentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
                  <CardTitle>Anjali Sharma</CardTitle>
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
                      <h3 className="text-2xl font-bold">12</h3>
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
                    {upcomingSessions.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                          <div key={session.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-muted rounded-lg">
                            <div>
                              <h4 className="font-medium">{session.courseTitle}</h4>
                              <p className="text-sm text-muted-foreground">with {session.teacherName}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{session.date}</span>
                                <span className="text-sm">{session.time}</span>
                              </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-2">
                              {session.status === "confirmed" ? (
                                <Button size="sm" className="bg-indian-green">
                                  Join Class
                                </Button>
                              ) : (
                                <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                  Pending
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
                    {enrolledCourses.length > 0 ? (
                      <div className="space-y-4">
                        {enrolledCourses.map((course) => (
                          <div key={course.id} className="flex flex-col p-4 bg-muted rounded-lg">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium">{course.title}</h4>
                              <span className="text-xs text-muted-foreground">Last accessed: {course.lastAccessed}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Teacher: {course.teacherName}</p>
                            <div className="w-full bg-background rounded-full h-2.5 mb-2">
                              <div 
                                className="bg-indian-saffron h-2.5 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">{course.progress}% completed</span>
                              <Button variant="ghost" size="sm" className="text-indian-saffron">
                                Continue Learning
                              </Button>
                            </div>
                          </div>
                        ))}
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
                  <p className="text-center py-12 text-muted-foreground">
                    Detailed course content will be implemented with Supabase integration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sessions">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Upcoming Sessions</h1>
              <Card>
                <CardContent className="p-6">
                  <p className="text-center py-12 text-muted-foreground">
                    Session management will be implemented with Supabase and Jitsi integration.
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

export default StudentDashboardPage;
