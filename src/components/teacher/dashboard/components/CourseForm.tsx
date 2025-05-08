
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

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

interface CourseFormProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  defaultValues: z.infer<typeof courseSchema>;
  onSubmit: (values: z.infer<typeof courseSchema>) => Promise<void>;
}

const CourseForm: React.FC<CourseFormProps> = ({
  isEditMode,
  isSubmitting,
  defaultValues,
  onSubmit,
}) => {
  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
  );
};

export default CourseForm;
