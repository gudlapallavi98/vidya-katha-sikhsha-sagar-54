
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, "Course name must be at least 2 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  price: z.number().min(0, "Price must be 0 or greater"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  course_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  sample_video: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  video_links: z.array(z.object({
    title: z.string().min(1, "Video title is required"),
    url: z.string().url("Please enter a valid YouTube URL"),
  })).max(10, "Maximum 10 video links allowed"),
  total_lessons: z.number().min(1, "Total lessons must be at least 1"),
});

export interface CourseFormData {
  title: string;
  category: string;
  price: number;
  description: string;
  course_link?: string;
  sample_video?: string;
  video_links: Array<{ title: string; url: string }>;
  total_lessons: number;
}

export interface CourseFormProps {
  defaultValues?: Partial<CourseFormData>;
  onSubmit: (values: CourseFormData) => Promise<void>;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ 
  defaultValues = {}, 
  onSubmit, 
  isSubmitting,
  isEditMode = false
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: defaultValues.title ?? "",
      category: defaultValues.category ?? "",
      price: defaultValues.price ?? 0,
      description: defaultValues.description ?? "",
      course_link: defaultValues.course_link ?? "",
      sample_video: defaultValues.sample_video ?? "",
      video_links: defaultValues.video_links ?? [{ title: "", url: "" }],
      total_lessons: defaultValues.total_lessons ?? 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "video_links",
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Ensure all required fields are present for CourseFormData
    const courseData: CourseFormData = {
      title: values.title,
      category: values.category,
      price: values.price,
      description: values.description,
      course_link: values.course_link || undefined,
      sample_video: values.sample_video || undefined,
      video_links: values.video_links,
      total_lessons: values.total_lessons,
    };
    await onSubmit(courseData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course name" {...field} />
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
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
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
                    placeholder="Enter total lessons"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter course description"
                  rows={4}
                  {...field}
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
              <FormLabel>Course Resource Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sample_video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sample Video (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Video Links (Max 10)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ title: "", url: "" })}
              disabled={fields.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Video
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-4 border rounded">
              <FormField
                control={form.control}
                name={`video_links.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Video title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`video_links.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="YouTube URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : isEditMode ? "Update Course" : "Create Course"}
        </Button>
      </form>
    </Form>
  );
};

export default CourseForm;
