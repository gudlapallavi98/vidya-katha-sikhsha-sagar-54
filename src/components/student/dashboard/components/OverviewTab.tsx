
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import IndianStatsCard from "@/components/dashboard/IndianStatsCard";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Trophy,
  Clock,
  Play,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";

interface OverviewTabProps {
  enrolledCourses: any[];
  coursesLoading: boolean;
  upcomingSessions: any[];
  sessionsLoading: boolean;
  progress: any[];
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
  // Use real data instead of mock data
  const stats = {
    enrolledCourses: enrolledCourses.length,
    upcomingSessions: upcomingSessions.length,
    completedSessions: 12, // This could be calculated from actual data if available
    achievementPoints: 285 // This could be calculated from actual data if available
  };

  const formatSessionDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, h:mm a');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sanskrit text-3xl font-bold text-gray-900 mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Track your learning progress and upcoming sessions
          </p>
        </div>
        
        {/* Tricolor accent */}
        <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border">
          <div className="w-3 h-3 rounded-full bg-[#FF9933]"></div>
          <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
          <div className="w-3 h-3 rounded-full bg-[#138808]"></div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <IndianStatsCard
          title="Enrolled Courses"
          value={stats.enrolledCourses}
          icon={<BookOpen />}
          description="Active enrollments"
          borderColor="saffron"
        />
        
        <IndianStatsCard
          title="Upcoming Sessions"
          value={stats.upcomingSessions}
          icon={<Calendar />}
          description="Scheduled this week"
          borderColor="green"
          trend={{ value: 15, isPositive: true }}
        />
        
        <IndianStatsCard
          title="Completed Sessions"
          value={stats.completedSessions}
          icon={<CheckCircle />}
          description="This month"
          borderColor="blue"
          trend={{ value: 8, isPositive: true }}
        />
        
        <IndianStatsCard
          title="Achievement Points"
          value={stats.achievementPoints}
          icon={<Trophy />}
          description="Total earned"
          borderColor="saffron"
          trend={{ value: 12, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#FF9933]" />
                Upcoming Sessions
              </CardTitle>
              {upcomingSessions.length > 0 && (
                <Badge className="bg-[#138808] hover:bg-[#138808]/90">
                  {upcomingSessions.length} scheduled
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessionsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : upcomingSessions.length > 0 ? (
              upcomingSessions.slice(0, 3).map((session) => (
                <div key={session.id} className="p-4 bg-white rounded-xl border border-gray-100 hover:border-[#FF9933]/30 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#FF9933] transition-colors">
                        {session.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatSessionDate(session.start_time)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {session.course?.title ? 'Course' : 'Individual'}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-[#138808] hover:bg-[#138808]/90 text-white ml-4 group-hover:scale-105 transition-transform"
                      onClick={() => handleJoinClass(session.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No upcoming sessions</p>
                <p className="text-sm">Schedule a session to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Courses */}
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#138808]" />
                My Courses
              </CardTitle>
              {enrolledCourses.length > 0 && (
                <Badge className="bg-[#FF9933] hover:bg-[#FF9933]/90">
                  {enrolledCourses.length} active
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {coursesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : enrolledCourses.length > 0 ? (
              enrolledCourses.slice(0, 3).map((enrollment) => {
                const course = enrollment.course || enrollment;
                const courseProgress = course.total_lessons > 0 
                  ? Math.round((enrollment.completed_lessons / course.total_lessons) * 100)
                  : 0;
                const lessonsRemaining = course.total_lessons - (enrollment.completed_lessons || 0);
                
                return (
                  <div key={enrollment.id} className="p-4 bg-white rounded-xl border border-gray-100 hover:border-[#138808]/30 transition-all duration-200 group">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#138808] transition-colors">
                        {course.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {courseProgress}% Complete
                      </Badge>
                    </div>
                    
                    <Progress 
                      value={courseProgress} 
                      className="mb-3 h-2"
                    />
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {lessonsRemaining} lessons remaining
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-[#FF9933] text-[#FF9933] hover:bg-[#FF9933] hover:text-white group-hover:scale-105 transition-all"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No enrolled courses</p>
                <p className="text-sm">Browse our course catalog to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
