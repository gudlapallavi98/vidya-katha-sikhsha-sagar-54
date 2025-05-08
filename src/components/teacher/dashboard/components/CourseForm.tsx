
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";

// Schema for course form validation
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  total_lessons: z.string().min(1, "Number of lessons is required"),
  course_link: z.string().optional(),
});

interface CourseFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [lessonLinks, setLessonLinks] = useState<string[]>(
    Array(parseInt(initialData?.total_lessons || "1")).fill("")
  );

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      total_lessons: initialData?.total_lessons?.toString() || "1",
      course_link: initialData?.course_link || "",
    },
  });

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setIsUploading(false);
  };

  const handleLessonLinksChange = (index: number, value: string) => {
    const newLinks = [...lessonLinks];
    newLinks[index] = value;
    setLessonLinks(newLinks);
  };

  const handleFormSubmit = (values: z.infer<typeof courseSchema>) => {
    // If total_lessons is 1, use the course_link directly
    // For multiple lessons, use the array of lessonLinks
    const finalLessonLinks = parseInt(values.total_lessons) === 1 
      ? values.course_link
      : lessonLinks.join(','); // Join multiple links with comma for storage
    
    onSubmit({
      ...values,
      total_lessons: parseInt(values.total_lessons),
      image_url: imageUrl,
      course_link: finalLessonLinks,
    });
  };

  const numberOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  // Watch the total_lessons field to update lessonLinks array when it changes
  const totalLessons = parseInt(form.watch("total_lessons") || "1");
  React.useEffect(() => {
    if (totalLessons !== lessonLinks.length) {
      // If initialData has course_link with multiple links, split them
      let initialLinks: string[] = [];
      if (initialData?.course_link && totalLessons > 1) {
        initialLinks = initialData.course_link.split(',');
        // Pad with empty strings if needed
        while (initialLinks.length < totalLessons) {
          initialLinks.push("");
        }
      } else {
        initialLinks = Array(totalLessons).fill("");
        if (initialData?.course_link && totalLessons === 1) {
          initialLinks[0] = initialData.course_link;
        }
      }
      setLessonLinks(initialLinks);
    }
  }, [totalLessons, initialData]);

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{initialData ? "Edit Course" : "Create New Course"}</DialogTitle>
        <DialogDescription>
          {initialData
            ? "Update your course information below."
            : "Fill in the details to create a new course."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Course Image Upload */}
            <div>
              <FormLabel>Course Image</FormLabel>
              <div className="mt-2">
                {isUploading ? (
                  <div className="h-40 bg-muted rounded flex items-center justify-center">
                    <p>Uploading...</p>
                  </div>
                ) : (
                  <FileUpload
                    onUploadStart={() => setIsUploading(true)}
                    onUploadComplete={handleImageUpload}
                    currentImageUrl={imageUrl}
                  />
                )}
              </div>
            </div>

            {/* Course Title */}
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

            {/* Course Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a description of your course"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Category */}
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
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Vedic Mathematics">Vedic Mathematics</SelectItem>
                      <SelectItem value="Sanskrit Language">Sanskrit Language</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                      <SelectItem value="Vedic Philosophy">Vedic Philosophy</SelectItem>
                      <SelectItem value="Meditation">Meditation</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Dance">Dance</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Number of Lessons */}
            <FormField
              control={form.control}
              name="total_lessons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Lessons</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of lessons" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {numberOptions.map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Course Links */}
            {totalLessons === 1 ? (
              <FormField
                control={form.control}
                name="course_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Resource Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-3">
                <FormLabel>Course Resource Links</FormLabel>
                {lessonLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <span className="text-sm w-[80px] shrink-0">Lesson {index + 1}:</span>
                    <Input
                      value={link}
                      onChange={(e) => handleLessonLinksChange(index, e.target.value)}
                      placeholder={`Link for lesson ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Course</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default CourseForm;
