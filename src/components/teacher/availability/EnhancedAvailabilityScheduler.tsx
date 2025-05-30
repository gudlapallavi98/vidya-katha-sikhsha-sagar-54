
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndividualAvailabilityForm } from "./IndividualAvailabilityForm";
import LiveCourseAvailabilityForm from "./LiveCourseAvailabilityForm";
import { AvailabilityList } from "./AvailabilityList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function EnhancedAvailabilityScheduler() {
  const [activeTab, setActiveTab] = useState("individual");
  const [refreshKey, setRefreshKey] = useState(0);
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
                onSuccess={handleAvailabilityCreated}
                onCancel={() => {}}
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
