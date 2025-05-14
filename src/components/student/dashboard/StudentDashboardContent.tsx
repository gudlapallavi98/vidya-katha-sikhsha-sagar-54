
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, GraduationCap, Award, Clock, BookOpenCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatsCard from "@/components/dashboard/StatsCard";
import StatsContainer from "@/components/dashboard/StatsContainer";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import SessionRequestForm from "@/components/student/SessionRequestForm";
import { Enrollment, Progress as StudentProgress, Session } from "@/hooks/types";

interface StudentDashboardContentProps {
  activeTab: string;
  enrolledCourses: Enrollment[];
  coursesLoading: boolean;
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  progress: StudentProgress[];
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const StudentDashboardContent: React.FC<StudentDashboardContentProps> = ({
  activeTab,
  enrolledCourses,
  coursesLoading,
  upcomingSessions,
  sessionsLoading,
  progress,
  handleJoinClass,
}) => {
  const navigate = useNavigate();
  const completedSessions = progress.filter(p => p.completed).length;

  const handleNavigateToCourses = () => {
    navigate('/courses');
  };

  if (activeTab === "overview") {
    return (
      <DashboardShell>
        <DashboardHeader 
          heading="Student Dashboard" 
          subheading="Welcome to your learning portal"
        />
        
        <StatsContainer>
          <StatsCard
            title="Enrolled Courses"
            value={enrolledCourses.length}
            icon={<BookOpen />}
            description="Active learning paths"
          />
          <StatsCard
            title="Upcoming Sessions"
            value={upcomingSessions.length}
            icon={<Calendar />}
            description="Scheduled learning"
          />
          <StatsCard
            title="Completed Sessions"
            value={completedSessions}
            icon={<GraduationCap />}
            description="Learning progress"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Achievement Points"
            value={progress.length * 10}
            icon={<Award />}
            description="Knowledge points earned"
          />
        </StatsContainer>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DashboardCard
            title="Upcoming Sessions"
            description="Your scheduled tutoring sessions"
            isLoading={sessionsLoading}
            headerAction={
              <Button variant="outline" size="sm" onClick={() => navigate('/student-dashboard?tab=sessions')}>
                View all
              </Button>
            }
          >
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{session.title}</h3>
                      <Badge variant={session.status === "in_progress" ? "default" : "outline"}>
                        {session.status === "in_progress" ? "Live Now" : "Upcoming"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.course?.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" /> 
                      {new Date(session.start_time).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })} at {new Date(session.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                    {session.status === "in_progress" && (
                      <Button size="sm" onClick={() => handleJoinClass(session.id)}>
                        Join Now
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[150px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed">
                <Calendar className="h-10 w-10 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                <Button variant="outline" size="sm" onClick={() => navigate('/student-dashboard?tab=request-session')}>
                  Request a Session
                </Button>
              </div>
            )}
          </DashboardCard>
          
          <DashboardCard
            title="My Courses"
            description="Your enrolled courses"
            isLoading={coursesLoading}
            headerAction={
              <Button variant="outline" size="sm" onClick={() => navigate('/student-dashboard?tab=courses')}>
                View all
              </Button>
            }
          >
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((enrollment) => {
                  const course = enrollment.course;
                  const courseProgress = course.total_lessons > 0 
                    ? Math.round((enrollment.completed_lessons / course.total_lessons) * 100)
                    : 0;
                    
                  return (
                    <div key={enrollment.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                      <h3 className="font-medium">{course.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <BookOpenCheck className="mr-1 h-3 w-3" /> 
                        {enrollment.completed_lessons} of {course.total_lessons} lessons completed
                      </div>
                      <div className="flex items-center justify-between">
                        <Progress value={courseProgress} className="h-2 w-full" />
                        <span className="ml-2 text-xs font-medium">{courseProgress}%</span>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto flex items-center">
                        Continue <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-[150px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed">
                <BookOpen className="h-10 w-10 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">No enrolled courses</p>
                <Button variant="outline" size="sm" onClick={handleNavigateToCourses}>
                  Browse Courses
                </Button>
              </div>
            )}
          </DashboardCard>
        </div>
      </DashboardShell>
    );
  }
  
  if (activeTab === "courses") {
    return (
      <DashboardShell>
        <DashboardHeader heading="My Courses" />
        
        <DashboardCard isLoading={coursesLoading}>
          {enrolledCourses.length > 0 ? (
            <div className="space-y-6">
              {enrolledCourses.map((enrollment) => {
                const course = enrollment.course;
                const courseProgress = course.total_lessons > 0 
                  ? Math.round((enrollment.completed_lessons / course.total_lessons) * 100)
                  : 0;
                  
                return (
                  <div key={enrollment.id} className="flex flex-col space-y-4 rounded-lg border p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium">{course.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{course.description}</p>
                      </div>
                      <div className="mt-2 md:mt-0 md:ml-4 md:shrink-0">
                        <Badge variant="outline">
                          Last accessed: {new Date(enrollment.last_accessed_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{courseProgress}%</span>
                      </div>
                      <Progress value={courseProgress} className="h-2 mt-1" />
                    </div>
                    <div className="flex justify-end">
                      <Button className="mt-2">Continue Learning</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
              <BookOpen className="h-16 w-16 text-muted-foreground/60" />
              <h3 className="text-xl font-medium">No Courses Enrolled</h3>
              <p className="text-sm text-muted-foreground">You haven't enrolled in any courses yet</p>
              <Button onClick={handleNavigateToCourses} className="mt-4">Browse Courses</Button>
            </div>
          )}
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  if (activeTab === "sessions") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Upcoming Sessions" />
        
        <DashboardCard isLoading={sessionsLoading}>
          {upcomingSessions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.title}</TableCell>
                    <TableCell>{session.course?.title}</TableCell>
                    <TableCell>
                      {new Date(session.start_time).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                      })} at {new Date(session.start_time).toLocaleTimeString('en-US', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={session.status === "in_progress" ? "default" : "outline"}>
                        {session.status === "in_progress" ? "Live Now" : 
                         session.status === "scheduled" ? "Upcoming" : session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {session.status === "in_progress" && (
                        <Button size="sm" onClick={() => handleJoinClass(session.id)}>
                          Join Now
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center space-y-2">
              <Calendar className="h-16 w-16 text-muted-foreground/60" />
              <h3 className="text-xl font-medium">No Upcoming Sessions</h3>
              <p className="text-sm text-muted-foreground">You don't have any upcoming sessions scheduled</p>
              <Button onClick={() => navigate('/student-dashboard?tab=request-session')} className="mt-4">
                Request a Session
              </Button>
            </div>
          )}
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  if (activeTab === "request-session") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Request a Session" />
        <DashboardCard>
          <SessionRequestForm />
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  if (activeTab === "profile") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Profile Settings" />
        <DashboardCard>
          <ProfileSettingsForm role="student" />
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  return null;
};

export default StudentDashboardContent;
