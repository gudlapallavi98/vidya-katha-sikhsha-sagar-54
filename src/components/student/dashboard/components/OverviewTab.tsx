
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, GraduationCap, Award, Clock, BookOpenCheck, ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatsCard from "@/components/dashboard/StatsCard";
import StatsContainer from "@/components/dashboard/StatsContainer";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Progress } from "@/components/ui/progress";
import { Enrollment, Progress as StudentProgress, Session } from "@/hooks/types";
import { format, isAfter, isBefore, subMinutes } from "date-fns";

interface OverviewTabProps {
  enrolledCourses: Enrollment[];
  coursesLoading: boolean;
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  progress: StudentProgress[];
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
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

  const canJoinSession = (session: Session) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    const sessionEnd = new Date(session.end_time);
    const canJoinTime = subMinutes(sessionStart, 5);
    
    return (session.status === 'in_progress' || session.status === 'scheduled') && 
           isAfter(now, canJoinTime) && 
           isBefore(now, sessionEnd);
  };

  const getSessionBadge = (session: Session) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    
    if (session.status === "in_progress") {
      return <Badge variant="default">Live Now</Badge>;
    } else if (isBefore(now, sessionStart)) {
      return <Badge variant="outline">Upcoming</Badge>;
    } else {
      return <Badge variant="secondary">Ended</Badge>;
    }
  };

  const formatSessionDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      console.log("Overview - Formatting session date:", { original: dateString, parsed: date });
      
      return {
        date: format(date, 'MMM d, yyyy'),
        time: format(date, 'h:mm a')
      };
    } catch (error) {
      console.error("Error formatting session date in overview:", error, { dateString });
      return {
        date: dateString,
        time: ''
      };
    }
  };

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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/student-dashboard?tab=sessions')}
            >
              View all
            </Button>
          }
        >
          {upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.slice(0, 3).map((session) => {
                const canJoin = canJoinSession(session);
                const { date, time } = formatSessionDateTime(session.start_time);
                
                console.log("Overview session rendering:", {
                  sessionId: session.id,
                  title: session.title,
                  startTime: session.start_time,
                  formattedDate: date,
                  formattedTime: time,
                  canJoin,
                  status: session.status
                });
                
                return (
                  <div key={session.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{session.title}</h3>
                      {getSessionBadge(session)}
                    </div>
                    <p className="text-sm text-muted-foreground">{session.course?.title || 'Individual Session'}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" /> 
                      {date} at {time}
                    </div>
                    {canJoin && (
                      <Button size="sm" onClick={() => handleJoinClass(session.id)} className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Join Now
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-[150px] flex-col items-center justify-center space-y-2 rounded-lg border border-dashed">
              <Calendar className="h-10 w-10 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">No upcoming sessions</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/student-dashboard?tab=request-session')}
              >
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/student-dashboard?tab=courses')}
            >
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-auto flex items-center"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
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
};

export default OverviewTab;
