
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndividualSessionCard } from "./IndividualSessionCard";
import { CourseCard } from "./CourseCard";

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
      console.log("Fetching individual sessions for teacher:", teacherId);
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

      if (error) {
        console.error("Error fetching individual sessions:", error);
        throw error;
      }
      console.log("Individual sessions fetched:", data);
      return data || [];
    },
  });

  // Fetch course sessions
  const { data: courseSlots = [], isLoading: courseLoading } = useQuery({
    queryKey: ["teacher-courses", teacherId],
    queryFn: async () => {
      console.log("Fetching courses for teacher:", teacherId);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("teacher_id", teacherId)
        .eq("is_published", true)
        .eq("enrollment_status", "open");

      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }
      console.log("Courses fetched:", data);
      return data || [];
    },
  });

  const handleSlotSelection = (slot: any) => {
    console.log("Slot selected in AvailabilitySelector:", slot);
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
                <IndividualSessionCard
                  key={slot.id}
                  slot={slot}
                  onSelectSlot={handleSlotSelection}
                />
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
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelectSlot={handleSlotSelection}
                />
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
