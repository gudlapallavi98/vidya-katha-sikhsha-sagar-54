
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  subject_id: z.string().min(1, "Subject is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
  available_date: z.date({
    required_error: "Available date is required",
  }),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  max_students: z.number().min(2, "Live courses must allow at least 2 students").max(20, "Maximum 20 students allowed"),
  price: z.number().min(0, "Price must be a positive number"),
}).refine((data) => data.end_date >= data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

interface Subject {
  id: string;
  name: string;
}

interface LiveCourseAvailabilityFormProps {
  onAvailabilityCreated?: () => void;
}

export default function LiveCourseAvailabilityForm({ onAvailabilityCreated }: LiveCourseAvailabilityFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      max_students: 10,
      price: 0,
    },
  });

  // Get current date in IST (India Standard Time)
  const getCurrentDateIST = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    return new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
  };

  // Format date for IST display
  const formatDateIST = (date: Date) => {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    }).format(istDate);
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!user) return;

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("subjects_interested")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile subjects:", profileError);
          return;
        }

        const subjectNames = profileData?.subjects_interested || [];

        if (subjectNames.length === 0) return;

        const { data, error } = await supabase
          .from("subjects")
          .select("*")
          .in("name", subjectNames);

        if (error) {
          console.error("Error fetching subjects:", error);
          return;
        }

        setSubjects(data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchSubjects();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      console.log("Submitting live course availability:", values);
      
      const { data, error } = await supabase
        .from("teacher_availability")
        .insert({
          teacher_id: user.id,
          subject_id: values.subject_id,
          start_date: values.start_date.toISOString().split('T')[0],
          end_date: values.end_date.toISOString().split('T')[0],
          available_date: values.available_date.toISOString().split('T')[0],
          start_time: values.start_time,
          end_time: values.end_time,
          status: "available",
          session_type: "group",
          max_students: values.max_students,
          price: values.price,
        })
        .select();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Live course availability created successfully:", data);

      toast({
        title: "Availability Created",
        description: "Your live course availability has been set successfully.",
      });

      form.reset({
        max_students: 5,
        price: 0,
      });
      
      if (onAvailabilityCreated) {
        onAvailabilityCreated();
      }
    } catch (error) {
      console.error("Error creating availability:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create availability. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Select onValueChange={(value) => form.setValue("subject_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.subject_id && (
            <p className="text-sm text-red-500">{form.formState.errors.subject_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_students">Maximum Students</Label>
          <Input
            id="max_students"
            type="number"
            min="2"
            max="20"
            placeholder="10"
            {...form.register("max_students", { valueAsNumber: true })}
          />
          {form.formState.errors.max_students && (
            <p className="text-sm text-red-500">{form.formState.errors.max_students.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Course Start Date (IST)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("start_date") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("start_date") ? (
                  formatDateIST(form.watch("start_date"))
                ) : (
                  <span>Pick start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("start_date")}
                onSelect={(date) => date && form.setValue("start_date", date)}
                disabled={(date) => date < getCurrentDateIST()}
                defaultMonth={getCurrentDateIST()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.start_date && (
            <p className="text-sm text-red-500">{form.formState.errors.start_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Course End Date (IST)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("end_date") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("end_date") ? (
                  formatDateIST(form.watch("end_date"))
                ) : (
                  <span>Pick end date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("end_date")}
                onSelect={(date) => date && form.setValue("end_date", date)}
                disabled={(date) => date < getCurrentDateIST()}
                defaultMonth={getCurrentDateIST()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.end_date && (
            <p className="text-sm text-red-500">{form.formState.errors.end_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price per student (₹)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            {...form.register("price", { valueAsNumber: true })}
          />
          {form.formState.errors.price && (
            <p className="text-sm text-red-500">{form.formState.errors.price.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Available Date (IST)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !form.watch("available_date") && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("available_date") ? (
                  formatDateIST(form.watch("available_date"))
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("available_date")}
                onSelect={(date) => date && form.setValue("available_date", date)}
                disabled={(date) => date < getCurrentDateIST()}
                defaultMonth={getCurrentDateIST()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {form.formState.errors.available_date && (
            <p className="text-sm text-red-500">{form.formState.errors.available_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time (IST)</Label>
          <Input
            id="start_time"
            type="time"
            {...form.register("start_time")}
          />
          {form.formState.errors.start_time && (
            <p className="text-sm text-red-500">{form.formState.errors.start_time.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_time">End Time (IST)</Label>
          <Input
            id="end_time"
            type="time"
            {...form.register("end_time")}
          />
          {form.formState.errors.end_time && (
            <p className="text-sm text-red-500">{form.formState.errors.end_time.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Live Course Availability"}
      </Button>
    </form>
  );
}
