
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, BookOpen, ClockIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";

interface Subject {
  id: string;
  name: string;
}

interface Availability {
  id: string;
  subject_id: string;
  subject: Subject;
  available_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export function AvailabilityScheduler() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Check if profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_completed")
        .eq("id", user.id)
        .single();
        
      if (error) {
        console.error("Error checking profile:", error);
        return;
      }
      
      setIsProfileComplete(data?.profile_completed || false);
    };
    
    checkProfile();
  }, [user]);

  // Fetch teacher's subjects
  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      if (!user) return;

      // Get teacher's interested subjects
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

      // Get subject details
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .in("name", subjectNames);

      if (error) {
        console.error("Error fetching subjects:", error);
        return;
      }

      setSubjects(data || []);
    };

    fetchTeacherSubjects();
  }, [user]);

  // Fetch existing availabilities
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("teacher_availability")
        .select(`
          *,
          subject:subjects(id, name)
        `)
        .eq("teacher_id", user.id);

      if (error) {
        console.error("Error fetching availabilities:", error);
        return;
      }

      setAvailabilities(data || []);
    };

    fetchAvailabilities();
  }, [user]);

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

      // Refresh availabilities
      const { data: newAvailabilities, error: fetchError } = await supabase
        .from("teacher_availability")
        .select(`
          *,
          subject:subjects(id, name)
        `)
        .eq("teacher_id", user.id);

      if (!fetchError) {
        setAvailabilities(newAvailabilities || []);
      }
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

  const removeAvailability = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("teacher_availability")
        .delete()
        .eq("id", id)
        .eq("teacher_id", user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setAvailabilities(availabilities.filter((a) => a.id !== id));

      toast({
        title: "Availability Removed",
        description: "Your availability slot has been removed",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
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
    <div className="space-y-8">
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

      <Card>
        <CardHeader>
          <CardTitle>Your Scheduled Availabilities</CardTitle>
        </CardHeader>
        <CardContent>
          {availabilities.length > 0 ? (
            <div className="space-y-4">
              {availabilities.map((availability) => (
                <div 
                  key={availability.id} 
                  className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indian-saffron" />
                      <span className="font-medium">{(availability.subject as Subject).name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(availability.available_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {availability.start_time.substring(0, 5)} - {availability.end_time.substring(0, 5)}
                      </span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-2 md:mt-0 text-red-500 border-red-500"
                    onClick={() => removeAvailability(availability.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              You haven't scheduled any availability yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AvailabilityScheduler;
