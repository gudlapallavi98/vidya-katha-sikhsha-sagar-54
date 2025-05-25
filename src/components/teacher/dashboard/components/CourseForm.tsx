
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  total_lessons: z.number().min(1, "Must have at least 1 lesson"),
  course_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  price: z.number().min(0, "Price must be 0 or greater"),
  is_published: z.boolean().default(false),
  sample_video: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  initialData?: Partial<CourseFormData>;
  isSubmitting?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, initialData, isSubmitting }) => {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      total_lessons: initialData?.total_lessons || 1,
      course_link: initialData?.course_link || "",
      price: initialData?.price || 0,
      is_published: initialData?.is_published || false,
      sample_video: initialData?.sample_video || "",
    },
  });

  const categories = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography", 
    "Computer Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Economics",
    "Business Studies",
    "Accounting",
    "Art",
    "Music",
    "Physical Education",
    "Other"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
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
                  placeholder="Describe your course"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
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
                <FormLabel>Total Lessons</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    step="0.01"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Set to 0 for free courses
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Publish Course</FormLabel>
                  <FormDescription>
                    Make this course visible to students
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="course_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Link (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://your-course-platform.com/course"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                External link to your course content
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sample_video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sample Video URL (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://youtube.com/watch?v=..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Preview video for students
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Course"}
        </Button>
      </form>
    </Form>
  );
};

export default CourseForm;
