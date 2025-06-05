
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, BookOpen, IndianRupee } from "lucide-react";
import { format } from "date-fns";

interface AvailabilitySelectorProps {
  teacherId: string;
  onSelectSlot: (slot: any) => void;
}

const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  teacherId,
  onSelectSlot,
}) => {
  const [activeTab, setActiveTab] = useState("individual");

  // Fetch individual sessions
  const { data: individualSlots = [], isLoading: individualLoading } = useQuery({
    queryKey: ["teacher-availability", teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_availability")
        .select(`
          *,
          subject:subjects(name)
        `)
        .eq("teacher_id", teacherId)
        .eq("session_type", "individual")
        .eq("status", "available")
        .gte("available_date", new Date().toISOString().split('T')[0])
        .order("available_date", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch course sessions
  const { data: courseSlots = [], isLoading: courseLoading } = useQuery({
    queryKey: ["teacher-courses", teacherId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("teacher_id", teacherId)
        .eq("is_published", true)
        .eq("enrollment_status", "open");

      if (error) throw error;
      return data || [];
    },
  });

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const handleSlotClick = (slot: any) => {
    console.log("Slot selected:", slot);
    onSelectSlot(slot);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Available Session</h2>
        <p className="text-gray-600">Choose from individual sessions or courses</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Sessions</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          {individualLoading ? (
            <div className="text-center py-8">Loading available slots...</div>
          ) : individualSlots.length > 0 ? (
            <div className="grid gap-4">
              {individualSlots.map((slot) => (
                <Card key={slot.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                          {slot.subject?.name || "Subject"}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1">
                          Individual Session
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 flex items-center">
                          <IndianRupee className="h-5 w-5" />
                          {slot.price || slot.teacher_rate || 100}
                        </div>
                        <p className="text-sm text-gray-500">per session</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{format(new Date(slot.available_date), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          {slot.booked_students || 0}/{slot.max_students || 1} students
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={slot.status === "available" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {slot.status}
                        </Badge>
                      </div>
                    </div>
                    {slot.notes && (
                      <p className="text-sm text-gray-600 mt-3 p-2 bg-gray-50 rounded">
                        {slot.notes}
                      </p>
                    )}
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => handleSlotClick(slot)}
                    >
                      Book This Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No individual sessions available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="courses">
          {courseLoading ? (
            <div className="text-center py-8">Loading available courses...</div>
          ) : courseSlots.length > 0 ? (
            <div className="grid gap-4">
              {courseSlots.map((course) => (
                <Card key={course.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          Course
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 flex items-center">
                          <IndianRupee className="h-5 w-5" />
                          {course.price || course.teacher_rate || 500}
                        </div>
                        <p className="text-sm text-gray-500">full course</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span>{course.total_lessons} lessons</span>
                      </div>
                      <Badge 
                        variant={course.enrollment_status === "open" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {course.enrollment_status}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => handleSlotClick(course)}
                    >
                      Enroll in Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No courses available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AvailabilitySelector;
