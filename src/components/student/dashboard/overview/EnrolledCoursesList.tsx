
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Enrollment } from "@/hooks/types";

interface EnrolledCoursesListProps {
  enrolledCourses: Enrollment[];
  isLoading: boolean;
}

const EnrolledCoursesList: React.FC<EnrolledCoursesListProps> = ({
  enrolledCourses,
  isLoading
}) => {
  const navigate = useNavigate();

  const handleNavigateToCourses = () => {
    navigate('/courses');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Courses</CardTitle>
        <CardDescription>Your enrolled courses</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
  );
};

export default EnrolledCoursesList;
