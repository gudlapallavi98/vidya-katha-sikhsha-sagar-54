
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Import our new components
import CourseList from "./components/CourseList";
import CourseForm from "./components/CourseForm";

interface TeacherCoursesProps {
  teacherCourses: any[];
  coursesLoading: boolean;
}

const TeacherCourses: React.FC<TeacherCoursesProps> = ({
  teacherCourses,
  coursesLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const defaultValues = {
    title: "",
    description: "",
    category: "",
    total_lessons: 1,
    course_link: ""
  };
  
  const handleCreateOrUpdateCourse = async (values: typeof defaultValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to manage courses",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode && currentCourseId) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: values.title,
            description: values.description,
            category: values.category,
            total_lessons: values.total_lessons,
            course_link: values.course_link || null
          })
          .eq('id', currentCourseId)
          .eq('teacher_id', user.id);
          
        if (error) throw error;
        
        toast({
          title: "Course Updated",
          description: "Your course has been updated successfully",
        });
      } else {
        // Create new course
        const { error } = await supabase
          .from('courses')
          .insert({
            title: values.title,
            description: values.description,
            category: values.category,
            total_lessons: values.total_lessons,
            teacher_id: user.id,
            course_link: values.course_link || null
          });
          
        if (error) throw error;
        
        toast({
          title: "Course Created",
          description: "Your course has been created successfully",
        });
      }
      
      // Close the dialog and reset form
      setIsOpen(false);
      setIsEditMode(false);
      setCurrentCourseId(null);
      
      // Refresh the list or navigate
      window.location.reload();
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Error managing course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditCourse = (course: any) => {
    setIsEditMode(true);
    setCurrentCourseId(course.id);
    setIsOpen(true);
  };
  
  const handleDeleteCourse = async () => {
    if (!courseToDelete || !user) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete)
        .eq('teacher_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Course Deleted",
        description: "Your course has been deleted successfully",
      });
      
      // Refresh the list
      window.location.reload();
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Error deleting course:", error);
    } finally {
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };
  
  const confirmDeleteCourse = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };
  
  const handleManageCourse = (courseId: string) => {
    navigate(`/teacher-dashboard/courses/${courseId}`);
  };

  const getFormDefaultValues = () => {
    if (isEditMode && currentCourseId) {
      const currentCourse = teacherCourses.find(course => course.id === currentCourseId);
      if (currentCourse) {
        return {
          title: currentCourse.title,
          description: currentCourse.description,
          category: currentCourse.category,
          total_lessons: currentCourse.total_lessons,
          course_link: currentCourse.course_link || ""
        };
      }
    }
    return defaultValues;
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-sanskrit text-3xl font-bold">My Courses</h1>
        
        <Dialog open={isOpen} onOpenChange={(value) => {
          setIsOpen(value);
          if (!value) {
            setIsEditMode(false);
            setCurrentCourseId(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Create New Course
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Course" : "Create New Course"}</DialogTitle>
            </DialogHeader>
            
            <CourseForm 
              isEditMode={isEditMode}
              isSubmitting={isSubmitting}
              defaultValues={getFormDefaultValues()}
              onSubmit={handleCreateOrUpdateCourse}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Card>
        <CardContent className="p-6">
          <CourseList 
            courses={teacherCourses}
            isLoading={coursesLoading}
            onOpenDialog={() => setIsOpen(true)}
            onEdit={handleEditCourse}
            onDelete={confirmDeleteCourse}
            onManage={handleManageCourse}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TeacherCourses;
