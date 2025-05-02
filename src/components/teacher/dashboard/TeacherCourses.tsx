
import React from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TeacherCoursesProps {
  teacherCourses: any[];
  coursesLoading: boolean;
}

const TeacherCourses: React.FC<TeacherCoursesProps> = ({
  teacherCourses,
  coursesLoading,
}) => {
  return (
    <>
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
    </>
  );
};

export default TeacherCourses;
