
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTeacherCourses as useTeacherCoursesQuery } from "@/hooks/use-teacher-data";
import { CourseFormData } from "../components/CourseForm";

export const useTeacherCourses = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { refetch } = useTeacherCoursesQuery();
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

  const handleSubmit = async (values: CourseFormData) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      const courseData = {
        teacher_id: user.id,
        title: values.title,
        description: values.description,
        category: values.category,
        total_lessons: values.total_lessons,
        course_link: values.course_link || null,
      };

      if (isEditMode && currentCourse) {
        const { error } = await supabase
          .from("courses")
          .update(courseData)
          .eq("id", currentCourse.id)
          .eq("teacher_id", user.id);

        if (error) throw error;

        toast({
          title: "Course Updated",
          description: "Your course has been updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("courses")
          .insert([courseData]);

        if (error) throw error;

        toast({
          title: "Course Created",
          description: "Your course has been created successfully.",
        });
      }

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
    window.location.href = `/teacher-dashboard/courses/${courseId}`;
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    isSubmitting,
    currentCourse,
    confirmDelete,
    setConfirmDelete,
    handleCreateCourse,
    handleEditCourse,
    handleDeleteCourse,
    handleSubmit,
    handleManageCourse,
  };
};
