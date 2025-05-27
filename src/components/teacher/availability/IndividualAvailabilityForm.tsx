
import React from "react";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  subject_id: z.string().min(1, "Please select a subject"),
  available_date: z.date({
    required_error: "Please select a date",
  }),
  start_time: z.string().min(1, "Please select start time"),
  end_time: z.string().min(1, "Please select end time"),
  price: z.number().min(0, "Price must be 0 or greater"),
  max_students: z.number().min(1, "Must allow at least 1 student"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface IndividualAvailabilityFormProps {
  subjects: Array<{ id: string; name: string }>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

const IndividualAvailabilityForm: React.FC<IndividualAvailabilityFormProps> = ({
  subjects,
  onSubmit,
  isLoading,
}) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      max_students: 1,
      price: 500,
      notes: "",
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;
  const selectedDate = watch("available_date");

  const handleFormSubmit = async (data: FormData) => {
    console.log("Form data before submission:", data);
    await onSubmit(data);
    reset();
  };

  // Generate time options
  const timeOptions = [];
  for (let hour = 6; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeOptions.push(timeString);
    }
  }

  // Get current date in IST
  const getCurrentDateIST = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const istTime = new Date(now.getTime() + istOffset);
    return new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Subject</Label>
          <Select onValueChange={(value) => setValue("subject_id", value)}>
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
          {errors.subject_id && (
            <p className="text-sm text-red-500 mt-1">{errors.subject_id.message}</p>
          )}
        </div>

        <div>
          <Label>Available Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  console.log("Selected date:", date);
                  if (date) {
                    // Create date in IST timezone
                    const istDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    setValue("available_date", istDate);
                  }
                }}
                disabled={(date) => {
                  // Disable past dates based on IST
                  const today = getCurrentDateIST();
                  return date < today;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.available_date && (
            <p className="text-sm text-red-500 mt-1">{errors.available_date.message}</p>
          )}
        </div>

        <div>
          <Label>Start Time</Label>
          <Select onValueChange={(value) => setValue("start_time", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.start_time && (
            <p className="text-sm text-red-500 mt-1">{errors.start_time.message}</p>
          )}
        </div>

        <div>
          <Label>End Time</Label>
          <Select onValueChange={(value) => setValue("end_time", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select end time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.end_time && (
            <p className="text-sm text-red-500 mt-1">{errors.end_time.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price">Price per Hour (₹)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="10"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="max_students">Maximum Students</Label>
          <Input
            id="max_students"
            type="number"
            min="1"
            max="10"
            {...register("max_students", { valueAsNumber: true })}
          />
          {errors.max_students && (
            <p className="text-sm text-red-500 mt-1">{errors.max_students.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Any additional notes about this session..."
          {...register("notes")}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Availability"}
      </Button>
    </form>
  );
};

export default IndividualAvailabilityForm;
