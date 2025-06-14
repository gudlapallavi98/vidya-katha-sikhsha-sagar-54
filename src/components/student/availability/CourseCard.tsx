
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, IndianRupee } from "lucide-react";

interface CourseCardProps {
  course: any;
  onSelectSlot: (course: any) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelectSlot,
}) => {
  const handleCourseClick = () => {
    console.log("Course selected:", course);
    onSelectSlot(course);
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary"
      onClick={handleCourseClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{course.title}</CardTitle>
            <Badge variant="outline" className="mt-1">
              Course
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600 flex items-center">
              <IndianRupee className="h-5 w-5" />
              {course.price || course.teacher_rate || 500}
            </div>
            <p className="text-sm text-gray-500">full course</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span>{course.total_lessons} lessons</span>
          </div>
          <Badge 
            variant={course.enrollment_status === "open" ? "default" : "secondary"}
            className="text-xs"
          >
            {course.enrollment_status}
          </Badge>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Click to enroll in this course
        </div>
      </CardContent>
    </Card>
  );
};
