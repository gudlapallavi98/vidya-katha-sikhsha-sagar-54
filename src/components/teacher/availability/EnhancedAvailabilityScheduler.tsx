
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndividualAvailabilityForm from "./IndividualAvailabilityForm";
import LiveCourseAvailabilityForm from "./LiveCourseAvailabilityForm";
import { AvailabilityList } from "./AvailabilityList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function EnhancedAvailabilityScheduler() {
  const [activeTab, setActiveTab] = useState("individual");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAvailabilityCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Fetch teacher's subjects from their profile
  const { data: subjects = [] } = useQuery({
    queryKey: ['teacher-subjects', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // First get teacher's interested subjects from profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subjects_interested')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return [];
      }
      
      const subjectNames = profile?.subjects_interested || [];
      if (subjectNames.length === 0) return [];
      
      // Get subject details
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id, name')
        .in('name', subjectNames)
        .order('name');
      
      if (subjectError) {
        console.error('Error fetching subjects:', subjectError);
        return [];
      }
      
      return subjectData || [];
    },
    enabled: !!user
  });

  const handleIndividualSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const availabilityData = {
        teacher_id: userData.user.id,
        subject_id: formData.subject_id,
        available_date: formData.available_date.toISOString().split('T')[0],
        start_time: formData.start_time,
        end_time: formData.end_time,
        price: formData.price,
        max_students: formData.max_students,
        notes: formData.notes,
        status: 'available',
        session_type: 'individual'
      };

      const { error } = await supabase
        .from('teacher_availability')
        .insert(availabilityData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Individual availability created successfully",
      });

      handleAvailabilityCreated();
    } catch (error) {
      console.error('Error creating availability:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create availability",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Availability</TabsTrigger>
          <TabsTrigger value="live-course">Live Course Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Individual Session Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <IndividualAvailabilityForm 
                subjects={subjects}
                onSubmit={handleIndividualSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="live-course" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Live Course Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <LiveCourseAvailabilityForm onAvailabilityCreated={handleAvailabilityCreated} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>My Availability Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <AvailabilityList 
            key={refreshKey}
            availabilities={[]} 
            onAvailabilityRemoved={handleAvailabilityCreated} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedAvailabilityScheduler;
