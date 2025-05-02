
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TeacherAvailability {
  id: string;
  teacher_id: string;
  subject_id: string;
  available_date: string;
  start_time: string;
  end_time: string;
  subject: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface Course {
  id: string;
  title: string;
  teacher_id: string;
}

export function SessionRequestForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [courseId, setCourseId] = useState("");
  const [availabilityId, setAvailabilityId] = useState("");
  const [availableTeachers, setAvailableTeachers] = useState<TeacherAvailability[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
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

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          course_id,
          course:courses(
            id,
            title,
            teacher_id
          )
        `)
        .eq("student_id", user.id);

      if (error) {
        console.error("Error fetching courses:", error);
        return;
      }

      if (data) {
        const courses = data.map((enrollment) => enrollment.course as Course);
        setEnrolledCourses(courses);
      }
    };

    fetchEnrolledCourses();
  }, [user]);

  // Fetch teacher availabilities when a course is selected
  useEffect(() => {
    const fetchTeacherAvailability = async () => {
      if (!courseId) {
        setAvailableTeachers([]);
        return;
      }

      // First get the teacher ID from the course
      const selectedCourse = enrolledCourses.find((course) => course.id === courseId);
      if (!selectedCourse) return;

      const { data, error } = await supabase
        .from("teacher_availability")
        .select(`
          *,
          subject:subjects(id, name),
          teacher:profiles(id, first_name, last_name)
        `)
        .eq("teacher_id", selectedCourse.teacher_id)
        .eq("status", "available")
        .gte("available_date", new Date().toISOString().split("T")[0]);

      if (error) {
        console.error("Error fetching teacher availability:", error);
        return;
      }

      setAvailableTeachers(data || []);
    };

    fetchTeacherAvailability();
  }, [courseId, enrolledCourses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !courseId || !availabilityId || !title) {
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
        description: "Please complete your profile before requesting a session"
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const selectedAvailability = availableTeachers.find(
        (avail) => avail.id === availabilityId
      );
      if (!selectedAvailability) throw new Error("Selected availability not found");

      // Insert session request
      const { error } = await supabase.from("session_requests").insert([
        {
          student_id: user.id,
          teacher_id: selectedAvailability.teacher_id,
          course_id: courseId,
          proposed_title: title,
          proposed_date: `${selectedAvailability.available_date}T${selectedAvailability.start_time}`,
          proposed_duration: calculateDuration(
            selectedAvailability.start_time,
            selectedAvailability.end_time
          ),
          request_message: message,
          status: "pending",
          availability_id: availabilityId,
        },
      ]);

      if (error) throw error;

      // Update availability status
      await supabase
        .from("teacher_availability")
        .update({ status: "requested" })
        .eq("id", availabilityId);

      toast({
        title: "Session Requested",
        description: "Your session request has been sent to the teacher",
      });

      // Reset form
      setTitle("");
      setMessage("");
      setCourseId("");
      setAvailabilityId("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Error requesting session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate duration in minutes between two times
  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / 60000;
  };

  const formatTimeRange = (startTime: string, endTime: string): string => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };
    
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  if (!isProfileComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p>Please complete your profile before requesting a session.</p>
            <Button onClick={() => window.location.href = "/student-dashboard?tab=profile"}>
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
        <CardTitle>Request a Session with Teacher</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {enrolledCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {courseId && availableTeachers.length > 0 ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Available Sessions</label>
              <Select value={availabilityId} onValueChange={setAvailabilityId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an available time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((avail) => (
                    <SelectItem key={avail.id} value={avail.id}>
                      {format(new Date(avail.available_date), "MMM dd, yyyy")} | {formatTimeRange(avail.start_time, avail.end_time)} | {avail.subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : courseId ? (
            <p className="text-sm text-muted-foreground">
              No availability found for the teacher of this course.
            </p>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium">Session Title</label>
            <Input
              placeholder="Enter a title for your session"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message (Optional)</label>
            <Textarea
              placeholder="Add any additional information for the teacher"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !courseId || !availabilityId || !title}
          >
            {isSubmitting ? "Sending Request..." : "Send Session Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default SessionRequestForm;
