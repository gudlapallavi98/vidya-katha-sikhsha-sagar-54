
import React, { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
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
  total_lessons: z.number().int().min(1, "Course must have at least 1 lesson")
});

const TeacherCourses: React.FC<TeacherCoursesProps> = ({
  teacherCourses,
  coursesLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      total_lessons: 1
    }
  });
  
  const handleCreateCourse = async (values: z.infer<typeof courseSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a course",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: values.title,
          description: values.description,
          category: values.category,
          total_lessons: values.total_lessons,
          teacher_id: user.id
        })
        .select();
        
      if (error) throw error;
      
      toast({
        title: "Course Created",
        description: "Your course has been created successfully",
      });
      
      // Close the dialog and reset form
      setIsOpen(false);
      form.reset();
      
      // Navigate to the course management page or refresh the list
      // This would require setting up additional routes and components
      // For now, we'll just force a page reload to show the new course
      window.location.reload();
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Error creating course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleManageCourse = (courseId: string) => {
    navigate(`/teacher-dashboard/courses/${courseId}`);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-sanskrit text-3xl font-bold">My Courses</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Create New Course
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateCourse)} className="space-y-4 py-4">
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
                        defaultValue={field.value}
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
                    {isSubmitting ? "Creating..." : "Create Course"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
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
              <DialogTrigger asChild>
                <Button onClick={() => setIsOpen(true)}>Create New Course</Button>
              </DialogTrigger>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TeacherCourses;
