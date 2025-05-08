
import React from "react";
import { BookOpen, Edit, Link, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: any;
  onEdit: (course: any) => void;
  onDelete: (courseId: string) => void;
  onManage: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onManage,
}) => {
  return (
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
          
          {course.course_link && (
            <div className="mt-3 flex items-center gap-2">
              <Link size={16} className="text-indian-blue" />
              <a 
                href={course.course_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indian-blue hover:underline"
              >
                Course Resource Link
              </a>
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(course)}>
              <Edit size={16} className="mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="text-red-500" onClick={() => onDelete(course.id)}>
              <Trash2 size={16} className="mr-1" /> Delete
            </Button>
            <Button onClick={() => onManage(course.id)}>Manage Course</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
