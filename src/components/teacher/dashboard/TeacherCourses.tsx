
import React, { useState } from "react";
import { BookOpen, Plus, Edit, Trash2, Link } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface TeacherCoursesProps {
  teacherCourses: any[];
  coursesLoading: boolean;
}

const courseCategories = [
  "Sanskrit Language",
  "Vedic Studies",
  "Yoga",
  "Meditation",
  "Ayurveda",
  "Philosophy",
  "Astrology",
  "History",
  "Literature",
  "Art & Culture"
];

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  total_lessons: z.number().int().min(1, "Course must have at least 1 lesson"),
  course_link: z.string().url("Please enter a valid URL").optional().or(z.literal(''))
});

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
  
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      total_lessons: 1,
      course_link: ""
    }
  });
  
  const handleCreateOrUpdateCourse = async (values: z.infer<typeof courseSchema>) => {
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
      form.reset();
      
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
    form.reset({
      title: course.title,
      description: course.description,
      category: course.category,
      total_lessons: course.total_lessons,
      course_link: course.course_link || ""
    });
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-sanskrit text-3xl font-bold">My Courses</h1>
        
        <Dialog open={isOpen} onOpenChange={(value) => {
          setIsOpen(value);
          if (!value) {
            setIsEditMode(false);
            setCurrentCourseId(null);
            form.reset();
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateOrUpdateCourse)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Sanskrit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="total_lessons"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Lessons</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="course_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Link (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/course" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a description of your course..." 
                          className="resize-none"
                          rows={5}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Course" : "Create Course")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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
                        <Button variant="outline" size="sm" onClick={() => handleEditCourse(course)}>
                          <Edit size={16} className="mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500" onClick={() => confirmDeleteCourse(course.id)}>
                          <Trash2 size={16} className="mr-1" /> Delete
                        </Button>
                        <Button onClick={() => handleManageCourse(course.id)}>Manage Course</Button>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsOpen(true)}>Create New Course</Button>
                </DialogTrigger>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TeacherCourses;
