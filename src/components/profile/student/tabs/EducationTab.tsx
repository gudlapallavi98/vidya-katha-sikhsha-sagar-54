
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EducationTabProps {
  form: UseFormReturn<any>;
}

export function EducationTab({ form }: EducationTabProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Education Information</h3>
      <p className="text-sm text-muted-foreground">
        Share details about your education to help us personalize your learning experience.
      </p>

      <FormField
        control={form.control}
        name="education_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education Level</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="primary">Primary School</SelectItem>
                <SelectItem value="middle">Middle School</SelectItem>
                <SelectItem value="secondary">Secondary School</SelectItem>
                <SelectItem value="higher_secondary">Higher Secondary</SelectItem>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                <SelectItem value="doctorate">Doctorate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="school_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>School/College/University Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your institution name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="grade_level"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Grade/Year</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select current grade or year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="grade_1">Grade 1</SelectItem>
                <SelectItem value="grade_2">Grade 2</SelectItem>
                <SelectItem value="grade_3">Grade 3</SelectItem>
                <SelectItem value="grade_4">Grade 4</SelectItem>
                <SelectItem value="grade_5">Grade 5</SelectItem>
                <SelectItem value="grade_6">Grade 6</SelectItem>
                <SelectItem value="grade_7">Grade 7</SelectItem>
                <SelectItem value="grade_8">Grade 8</SelectItem>
                <SelectItem value="grade_9">Grade 9</SelectItem>
                <SelectItem value="grade_10">Grade 10</SelectItem>
                <SelectItem value="grade_11">Grade 11</SelectItem>
                <SelectItem value="grade_12">Grade 12</SelectItem>
                <SelectItem value="year_1">1st Year</SelectItem>
                <SelectItem value="year_2">2nd Year</SelectItem>
                <SelectItem value="year_3">3rd Year</SelectItem>
                <SelectItem value="year_4">4th Year</SelectItem>
                <SelectItem value="masters_1">Masters 1st Year</SelectItem>
                <SelectItem value="masters_2">Masters 2nd Year</SelectItem>
                <SelectItem value="doctorate">Doctorate</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="bg-muted p-4 rounded-md">
        <h4 className="font-medium mb-2">Why is this information important?</h4>
        <p className="text-sm text-muted-foreground">
          Sharing your education details helps us recommend appropriate courses, connect you with suitable tutors, and provide learning materials tailored to your academic level.
        </p>
      </div>
    </div>
  );
}
