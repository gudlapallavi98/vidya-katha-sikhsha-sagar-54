
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TeachingExperienceTabProps {
  form: UseFormReturn<any>;
}

// Generate experience options from 1 to 40+ years
const experienceOptions = [
  { value: "< 1", label: "Less than 1 year" },
  ...Array.from({ length: 40 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} ${i + 1 === 1 ? 'year' : 'years'}`
  })),
  { value: "40+", label: "40+ years" }
];

export function TeachingExperienceTab({ form }: TeachingExperienceTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Teaching Experience</h3>
      <p className="text-sm text-muted-foreground">
        Share your teaching background and expertise to help students understand your qualifications.
      </p>

      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experience Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe your teaching experience, methodology, and approach..."
                className="resize-none"
                rows={5}
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
        name="intro_video_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Introduction Video URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://youtube.com/..."
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
            <p className="text-sm text-muted-foreground mt-1">
              Share a video introduction to showcase your teaching style to potential students.
            </p>
          </FormItem>
        )}
      />
    </div>
  );
}
