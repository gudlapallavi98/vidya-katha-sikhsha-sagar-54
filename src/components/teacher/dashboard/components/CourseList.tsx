
import React from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseCard from "./CourseCard";

interface CourseListProps {
  courses: any[];
  isLoading: boolean;
  onEdit: (course: any) => void;
  onDelete: (courseId: string) => void;
  onManage: (courseId: string) => void;
  onOpenDialog?: () => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  isLoading,
  onEdit,
  onDelete,
  onManage,
  onOpenDialog,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Loading courses...</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-medium mb-2">No Courses Created</h3>
        <p className="text-muted-foreground mb-6">You haven't created any courses yet.</p>
        <Button onClick={onOpenDialog}>Create New Course</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {courses.map((course) => (
        <CourseCard 
          key={course.id}
          course={course}
          onEdit={onEdit}
          onDelete={onDelete}
          onManage={onManage}
        />
      ))}
    </div>
  );
};

export default CourseList;
