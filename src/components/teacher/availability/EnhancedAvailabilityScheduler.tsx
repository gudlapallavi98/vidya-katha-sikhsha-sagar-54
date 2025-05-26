
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndividualAvailabilityForm from "./IndividualAvailabilityForm";
import LiveCourseAvailabilityForm from "./LiveCourseAvailabilityForm";
import { AvailabilityList } from "./AvailabilityList";

export function EnhancedAvailabilityScheduler() {
  const [activeTab, setActiveTab] = useState("individual");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAvailabilityCreated = () => {
    setRefreshKey(prev => prev + 1);
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
              <IndividualAvailabilityForm onAvailabilityCreated={handleAvailabilityCreated} />
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
