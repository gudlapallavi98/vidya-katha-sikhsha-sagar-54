
import { UseFormReturn } from "react-hook-form";
import { format, parse } from "date-fns";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
  { label: "Prefer not to say", value: "not_specified" },
];

// Generate arrays for days, months, and years
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: 100 },
  (_, i) => (currentYear - 100 + i + 1).toString()
);

interface BasicInfoSectionProps {
  form: UseFormReturn<any>;
}

const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  const dateOfBirth = form.watch("date_of_birth");
  
  // Extract day, month, and year from the date_of_birth
  let birthDay = "";
  let birthMonth = "";
  let birthYear = "";
  
  if (dateOfBirth) {
    const date = new Date(dateOfBirth);
    birthDay = date.getDate().toString().padStart(2, '0');
    birthMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    birthYear = date.getFullYear().toString();
  }
  
  // Update the date_of_birth field when day, month, or year changes
  const updateDateOfBirth = (day: string, month: string, year: string) => {
    if (day && month && year) {
      try {
        const dateString = `${year}-${month}-${day}`;
        const date = parse(dateString, 'yyyy-MM-dd', new Date());
        
        // Only update if it's a valid date
        if (!isNaN(date.getTime())) {
          form.setValue("date_of_birth", date);
        }
      } catch (error) {
        console.error("Invalid date:", error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input placeholder="Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="display_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Display Name</FormLabel>
            <FormControl>
              <Input placeholder="JohnDoe123" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-2">
        <FormLabel className="block mb-2">Date of Birth</FormLabel>
        <div className="grid grid-cols-3 gap-2">
          <FormItem>
            <Select 
              value={birthDay}
              onValueChange={(value) => updateDateOfBirth(value, birthMonth, birthYear)}
            >
              <SelectTrigger className={cn(!birthDay && "text-muted-foreground")}>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          <FormItem>
            <Select 
              value={birthMonth}
              onValueChange={(value) => updateDateOfBirth(birthDay, value, birthYear)}
            >
              <SelectTrigger className={cn(!birthMonth && "text-muted-foreground")}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
          
          <FormItem>
            <Select 
              value={birthYear}
              onValueChange={(value) => updateDateOfBirth(birthDay, birthMonth, value)}
            >
              <SelectTrigger className={cn(!birthYear && "text-muted-foreground")}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        </div>
        <FormMessage>{form.formState.errors.date_of_birth?.message}</FormMessage>
      </div>
    </div>
  );
};

export default BasicInfoSection;
