
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

import { FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";

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

interface DateOfBirthSelectorProps {
  form: UseFormReturn<any>;
}

const DateOfBirthSelector = ({ form }: DateOfBirthSelectorProps) => {
  const [birthDay, setBirthDay] = useState<string>("");
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthYear, setBirthYear] = useState<string>("");
  
  // Extract day, month, and year from the date_of_birth when component mounts or when the value changes
  useEffect(() => {
    const dateOfBirth = form.watch("date_of_birth");
    
    if (dateOfBirth) {
      try {
        const date = new Date(dateOfBirth);
        if (!isNaN(date.getTime())) {
          setBirthDay(date.getDate().toString().padStart(2, '0'));
          setBirthMonth((date.getMonth() + 1).toString().padStart(2, '0'));
          setBirthYear(date.getFullYear().toString());
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  }, [form.watch("date_of_birth")]);
  
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
    <div className="col-span-2">
      <FormLabel className="block mb-2">Date of Birth</FormLabel>
      <div className="grid grid-cols-3 gap-2">
        <FormItem>
          <Select 
            value={birthDay}
            onValueChange={(value) => {
              setBirthDay(value);
              updateDateOfBirth(value, birthMonth, birthYear);
            }}
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
            onValueChange={(value) => {
              setBirthMonth(value);
              updateDateOfBirth(birthDay, value, birthYear);
            }}
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
            onValueChange={(value) => {
              setBirthYear(value);
              updateDateOfBirth(birthDay, birthMonth, value);
            }}
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
      {form.formState.errors.date_of_birth && (
        <p className="text-sm font-medium text-destructive mt-2">
          {form.formState.errors.date_of_birth.message?.toString()}
        </p>
      )}
    </div>
  );
};

export default DateOfBirthSelector;
