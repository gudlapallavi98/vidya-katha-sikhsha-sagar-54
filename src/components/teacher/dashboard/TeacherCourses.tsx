import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherCourses } from "@/hooks/use-teacher-data";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import CourseForm from "./components/CourseForm";
import CourseList from "./components/CourseList";

interface TeacherCoursesProps {
  teacherCourses: any[];
  coursesLoading: boolean;
}

const TeacherCourses: React.FC<TeacherCoursesProps> = ({ 
  teacherCourses, 
  coursesLoading 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refetch } = useTeacherCourses();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleCreateCourse = () => {
    setIsEditMode(false);
    setCurrentCourse(null);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: any) => {
    setIsEditMode(true);
    setCurrentCourse(course);
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId)
        .eq("teacher_id", user?.id);

      if (error) throw error;

      toast({
        title: "Course Deleted",
        description: "The course has been successfully deleted.",
      });

      // Refresh courses list
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete course. Please try again.",
      });
      console.error("Error deleting course:", error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleSubmit = async (values: {
    title: string;
    description: string;
    category: string;
    total_lessons: number;
    course_link: string;
  }) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      if (isEditMode && currentCourse) {
        // Update existing course
        const { error } = await supabase
          .from("courses")
          .update({
            title: values.title,
            description: values.description,
            category: values.category,
            total_lessons: values.total_lessons,
            course_link: values.course_link,
            image_url: currentCourse.image_url, // Preserve existing image
          })
          .eq("id", currentCourse.id)
          .eq("teacher_id", user.id);

        if (error) throw error;

        toast({
          title: "Course Updated",
          description: "Your course has been updated successfully.",
        });
      } else {
        // Create new course
        const { error } = await supabase.from("courses").insert([
          {
            teacher_id: user.id,
            title: values.title,
            description: values.description,
            category: values.category,
            total_lessons: values.total_lessons,
            course_link: values.course_link,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Course Created",
          description: "Your course has been created successfully.",
        });
      }

      // Close dialog and refresh courses
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save course. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageCourse = (courseId: string) => {
    // Navigate to course management page
    window.location.href = `/teacher-dashboard/courses/${courseId}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="font-sanskrit text-3xl font-bold">Your Courses</h1>
        <Button onClick={handleCreateCourse} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Course
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <CourseList 
            courses={teacherCourses}
            isLoading={coursesLoading}
            onEdit={handleEditCourse}
            onDelete={(courseId) => setConfirmDelete(courseId)}
            onManage={handleManageCourse}
            onOpenDialog={handleCreateCourse}
          />
        </CardContent>
      </Card>

      {/* Course Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Course" : "Create New Course"}
            </DialogTitle>
          </DialogHeader>
          <CourseForm
            defaultValues={{
              title: currentCourse?.title || "",
              description: currentCourse?.description || "",
              category: currentCourse?.category || "",
              total_lessons: currentCourse?.total_lessons || 1,
              course_link: currentCourse?.course_link || "",
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && handleDeleteCourse(confirmDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeacherCourses;
