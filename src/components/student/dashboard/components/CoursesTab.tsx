
import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import { Progress } from "@/components/ui/progress";
import { Enrollment } from "@/hooks/types";

interface CoursesTabProps {
  enrolledCourses: Enrollment[];
  coursesLoading: boolean;
}

const CoursesTab: React.FC<CoursesTabProps> = ({
  enrolledCourses,
  coursesLoading,
}) => {
  const navigate = useNavigate();

  const handleNavigateToCourses = () => {
    navigate('/courses');
  };

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
};

export default CoursesTab;
