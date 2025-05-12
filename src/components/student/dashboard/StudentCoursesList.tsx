
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Enrollment } from "@/hooks/types";
import { useNavigate } from "react-router-dom";

interface StudentCoursesListProps {
  enrolledCourses: Enrollment[];
  coursesLoading: boolean;
}

const StudentCoursesList: React.FC<StudentCoursesListProps> = ({
  enrolledCourses,
  coursesLoading
}) => {
  const navigate = useNavigate();

  const handleNavigateToCourses = () => {
    navigate('/courses');
  };

  return (
    <>
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
              <Button onClick={handleNavigateToCourses}>Browse Courses</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default StudentCoursesList;
