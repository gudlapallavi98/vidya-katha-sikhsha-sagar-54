
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface Subject {
  id: string;
  name: string;
}

interface AvailabilityFormProps {
  subjects: Subject[];
  onAvailabilityAdded: () => void;
  isProfileComplete: boolean;
}

export function AvailabilityForm({ subjects, onAvailabilityAdded, isProfileComplete }: AvailabilityFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !date || !startTime || !endTime || !selectedSubjectId) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields",
      });
      return;
    }

    if (!isProfileComplete) {
      toast({
        variant: "destructive", 
        title: "Profile incomplete",
        description: "Please complete your profile before scheduling availability"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Format date for database
      const formattedDate = format(date, "yyyy-MM-dd");

      // Add availability
      const { error } = await supabase
        .from("teacher_availability")
        .insert([
          {
            teacher_id: user.id,
            subject_id: selectedSubjectId,
            available_date: formattedDate,
            start_time: startTime,
            end_time: endTime,
            status: "available",
          },
        ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Availability Scheduled",
        description: "Your availability has been successfully scheduled",
      });

      // Reset form
      setDate(new Date());
      setStartTime("");
      setEndTime("");
      setSelectedSubjectId("");

      // Notify parent component to refresh availabilities
      onAvailabilityAdded();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Error scheduling availability:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isProfileComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p>Please complete your profile before scheduling availability.</p>
            <Button onClick={() => window.location.href = "/teacher-dashboard?tab=profile"}>
              Go to Profile Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Your Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select 
              value={selectedSubjectId} 
              onValueChange={setSelectedSubjectId}
            >
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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !date || !startTime || !endTime || !selectedSubjectId}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Availability"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
