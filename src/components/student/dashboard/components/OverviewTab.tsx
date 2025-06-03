
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Calendar, GraduationCap, Award, Clock, BookOpenCheck, ArrowRight, Video, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndianStatsCard from "@/components/dashboard/IndianStatsCard";
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
    const canJoinTime = subMinutes(sessionStart, 15);
    
    return (session.status === 'in_progress' || session.status === 'scheduled') && 
           isAfter(now, canJoinTime) && 
           isBefore(now, sessionEnd);
  };

  const getSessionBadge = (session: Session) => {
    const now = new Date();
    const sessionStart = new Date(session.start_time);
    
    if (session.status === "in_progress") {
      return (
        <Badge className="bg-red-500 text-white animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
          Live Now
        </Badge>
      );
    } else if (isBefore(now, sessionStart)) {
      return <Badge variant="outline" className="border-[#000080] text-[#000080]">Upcoming</Badge>;
    } else {
      return <Badge variant="secondary">Ended</Badge>;
    }
  };

  const formatSessionDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
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
    <main className="flex-1 space-y-6 p-6">
      {/* Header with motivational banner */}
      <div className="bg-gradient-to-r from-[#FF9933] via-white to-[#138808] p-1 rounded-lg">
        <div className="bg-[#fdf6ee] p-6 rounded-md">
          <DashboardHeader 
            heading="Welcome to Your Learning Journey" 
            subheading="Excellence is not a skill, it's an attitude. Keep learning, keep growing!"
          />
        </div>
      </div>
      
      {/* Stats Cards */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <IndianStatsCard
          title="Enrolled Courses"
          value={enrolledCourses.length}
          icon={<BookOpen />}
          description="Active learning paths"
          borderColor="saffron"
        />
        <IndianStatsCard
          title="Upcoming Sessions"
          value={upcomingSessions.length}
          icon={<Calendar />}
          description="Scheduled learning"
          borderColor="green"
        />
        <IndianStatsCard
          title="Completed Sessions"
          value={completedSessions}
          icon={<GraduationCap />}
          description="Learning progress"
          trend={{ value: 12, isPositive: true }}
          borderColor="blue"
        />
        <IndianStatsCard
          title="Achievement Points"
          value={progress.length * 10}
          icon={<Award />}
          description="Knowledge points earned"
          borderColor="saffron"
        />
      </section>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Upcoming Sessions</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Your scheduled tutoring sessions</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition-all duration-200"
              onClick={() => navigate('/student-dashboard?tab=sessions')}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9933]"></div>
              </div>
            ) : upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 3).map((session) => {
                  const canJoin = canJoinSession(session);
                  const { date, time } = formatSessionDateTime(session.start_time);
                  
                  return (
                    <div key={session.id} className="p-4 rounded-lg border border-gray-100 hover:border-[#FF9933]/30 transition-all duration-200 hover:shadow-md">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{session.title}</h3>
                        {getSessionBadge(session)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{session.course?.title || 'Individual Session'}</p>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <Clock className="mr-1 h-3 w-3" /> 
                        {date} at {time}
                      </div>
                      {canJoin && (
                        <Button 
                          size="sm" 
                          onClick={() => handleJoinClass(session.id)} 
                          className="w-full bg-[#138808] hover:bg-[#138808]/90 text-white transition-all duration-200 hover:scale-105"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Join Now
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center space-y-3 text-center">
                <Calendar className="h-12 w-12 text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-500">No upcoming sessions</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-[#138808] text-[#138808] hover:bg-[#138808] hover:text-white transition-all duration-200"
                    onClick={() => navigate('/student-dashboard?tab=request-session')}
                  >
                    Request a Session
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* My Courses */}
        <Card className="shadow-lg border-0 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">My Courses</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Your enrolled courses</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white transition-all duration-200"
              onClick={() => navigate('/student-dashboard?tab=courses')}
            >
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9933]"></div>
              </div>
            ) : enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((enrollment) => {
                  const course = enrollment.course;
                  const courseProgress = course.total_lessons > 0 
                    ? Math.round((enrollment.completed_lessons / course.total_lessons) * 100)
                    : 0;
                    
                  return (
                    <div key={enrollment.id} className="p-4 rounded-lg border border-gray-100 hover:border-[#FF9933]/30 transition-all duration-200 hover:shadow-md">
                      <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <BookOpenCheck className="mr-1 h-3 w-3" /> 
                        {enrollment.completed_lessons} of {course.total_lessons} lessons completed
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <Progress value={courseProgress} className="h-2 flex-1 mr-3" />
                        <span className="text-xs font-medium text-[#138808]">{courseProgress}%</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-center text-[#FF9933] hover:bg-[#FF9933]/10 transition-all duration-200 hover:scale-105"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        Continue <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center space-y-3 text-center">
                <BookOpen className="h-12 w-12 text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-gray-500">No enrolled courses</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-[#138808] text-[#138808] hover:bg-[#138808] hover:text-white transition-all duration-200"
                    onClick={handleNavigateToCourses}
                  >
                    Browse Courses
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6">
        <Button 
          className="rounded-full h-14 w-14 bg-[#000080] hover:bg-[#000080]/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="icon"
        >
          <Video className="h-6 w-6" />
        </Button>
      </div>
    </main>
  );
};

export default OverviewTab;
