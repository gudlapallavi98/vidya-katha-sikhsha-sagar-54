
import React from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";
import CourseCard from "./CourseCard";

interface CourseListProps {
  courses: any[];
  isLoading: boolean;
  onOpenDialog: () => void;
  onEdit: (course: any) => void;
  onDelete: (courseId: string) => void;
  onManage: (courseId: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  isLoading,
  onOpenDialog,
  onEdit,
  onDelete,
  onManage,
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
        <DialogTrigger asChild>
          <Button onClick={onOpenDialog}>Create New Course</Button>
        </DialogTrigger>
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
