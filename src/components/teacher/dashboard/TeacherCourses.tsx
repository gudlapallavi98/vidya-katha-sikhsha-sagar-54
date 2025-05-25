
import React from "react";
import { PlusCircle } from "lucide-react";
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
import { useTeacherCourses } from "./hooks/useTeacherCourses";

interface TeacherCoursesProps {
  teacherCourses: any[];
  coursesLoading: boolean;
}

const TeacherCourses: React.FC<TeacherCoursesProps> = ({ 
  teacherCourses, 
  coursesLoading 
}) => {
  const {
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
  } = useTeacherCourses();

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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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
              price: currentCourse?.price || 0,
              total_lessons: currentCourse?.total_lessons || 1,
              course_link: currentCourse?.course_link || "",
              sample_video: currentCourse?.sample_video || "",
              is_published: currentCourse?.is_published || false,
            }}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        </DialogContent>
      </Dialog>

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
