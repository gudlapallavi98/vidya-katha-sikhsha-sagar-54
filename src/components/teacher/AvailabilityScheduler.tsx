
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, BookOpen, ClockIcon, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSessionStatus } from "@/hooks/use-session-status";

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
  const { cancelExpiredAvailabilities } = useSessionStatus();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");

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

  // Run cancelExpiredAvailabilities when component mounts
  useEffect(() => {
    cancelExpiredAvailabilities();
    
    // Setup interval to check for expired availabilities every hour
    const intervalId = setInterval(() => {
      cancelExpiredAvailabilities();
    }, 60 * 60 * 1000); // 1 hour
    
    return () => clearInterval(intervalId);
  }, [cancelExpiredAvailabilities]);

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
    
    // Validate the date is at least 24h in future and at most 7 days in future
    const now = new Date();
    const selectedDate = new Date(date);
    const minDate = new Date();
    minDate.setDate(now.getDate() + 1);
    
    const maxDate = new Date();
    maxDate.setDate(now.getDate() + 7);
    
    if (selectedDate < minDate) {
      toast({
        variant: "destructive",
        title: "Invalid date",
        description: "Availability must be scheduled at least 24 hours in advance"
      });
      return;
    }
    
    if (selectedDate > maxDate) {
      toast({
        variant: "destructive",
        title: "Invalid date",
        description: "Availability can only be scheduled up to 7 days in advance"
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

  // Filter availabilities based on selected tab
  const filteredAvailabilities = availabilities.filter(availability => {
    const availableDate = new Date(availability.available_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate date comparison
    
    if (activeTab === "upcoming") {
      return availableDate >= today && availability.status === 'available';
    } else {
      return availableDate < today || availability.status === 'expired';
    }
  });

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
                    disabled={(date) => {
                      // Disable dates less than 24 hours from now and more than 7 days from now
                      const now = new Date();
                      const minDate = new Date();
                      minDate.setDate(now.getDate() + 1);
                      
                      const maxDate = new Date();
                      maxDate.setDate(now.getDate() + 7);
                      
                      return date < minDate || date > maxDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-1">
                You can schedule availability between 24 hours and 7 days in advance.
              </p>
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
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Past
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <TabsContent value="upcoming" className="mt-0">
            {filteredAvailabilities.length > 0 ? (
              <div className="space-y-4">
                {filteredAvailabilities.map((availability) => (
                  <div 
                    key={availability.id} 
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg bg-card"
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
                You don't have any upcoming availability scheduled.
              </p>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            {filteredAvailabilities.length > 0 ? (
              <div className="space-y-4">
                {filteredAvailabilities.map((availability) => (
                  <div 
                    key={availability.id} 
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{(availability.subject as Subject).name}</span>
                        {availability.status === 'expired' && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            Expired
                          </span>
                        )}
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                You don't have any past availability slots.
              </p>
            )}
          </TabsContent>
        </CardContent>
      </Card>
    </div>
  );
}

export default AvailabilityScheduler;
