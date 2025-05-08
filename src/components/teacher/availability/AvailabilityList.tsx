
import { useState } from "react";
import { BookOpen, CalendarIcon, ClockIcon, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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

interface AvailabilityListProps {
  availabilities: Availability[];
  onAvailabilityRemoved: () => void;
}

export function AvailabilityList({ availabilities, onAvailabilityRemoved }: AvailabilityListProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");

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

      toast({
        title: "Availability Removed",
        description: "Your availability slot has been removed",
      });

      // Notify parent component to refresh availabilities
      onAvailabilityRemoved();
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
      return availableDate >= today;
    } else {
      return availableDate < today;
    }
  });

  return (
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
  );
}
