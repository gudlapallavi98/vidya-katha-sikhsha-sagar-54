import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "@/components/ui/file-upload";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  total_lessons: z.number().min(1, {
    message: "Total lessons must be at least 1.",
  }),
  course_link: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

export interface CourseFormProps {
  defaultValues: {
    title: string;
    description: string;
    category: string;
    total_lessons: number;
    course_link: string;
  };
  onSubmit: (values: {
    title: string;
    description: string;
    category: string;
    total_lessons: number;
    course_link: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ 
  defaultValues, 
  onSubmit, 
  isSubmitting,
  isEditMode = false
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues.title,
      description: defaultValues.description,
      category: defaultValues.category,
      total_lessons: defaultValues.total_lessons,
      course_link: defaultValues.course_link,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="mt-6 space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Course title" {...field} />
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
                  <Input placeholder="Course description" {...field} />
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
                <FormControl>
                  <Input placeholder="Course category" {...field} />
                </FormControl>
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
                    placeholder="Total lessons"
                    {...field}
                    onChange={(e) => {
                      // Ensure the value is always a number
                      const value = parseInt(e.target.value);
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
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
                <FormLabel>Course Resource Link</FormLabel>
                <FormControl>
                  <Input placeholder="Course link" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-6 space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="image">Course Image</Label>
            <FileUpload 
              onUploadComplete={(url: string) => {
                setImageUrl(url);
              }} 
              currentImageUrl={imageUrl}
              userId=""
            />
          </div>
          
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
