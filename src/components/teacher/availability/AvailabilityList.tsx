
import { useAvailabilityData } from "./hooks/useAvailabilityData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AvailabilityListProps {
  availabilities?: any[];
  onAvailabilityRemoved: () => void;
}

export function AvailabilityList({ availabilities = [], onAvailabilityRemoved }: AvailabilityListProps) {
  const { availabilities: fetchedAvailabilities, isLoading } = useAvailabilityData();
  const { toast } = useToast();
  
  // Use fetched data if availabilities prop is empty
  const displayAvailabilities = availabilities.length > 0 ? availabilities : (fetchedAvailabilities || []);

  const handleRemoveAvailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from('teacher_availability')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Availability Removed",
        description: "Your availability has been successfully removed.",
      });

      onAvailabilityRemoved();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove availability. Please try again.",
      });
    }
  };

  // Format date for IST display
  const formatDateIST = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  };

  // Format time for IST display
  const formatTimeIST = (timeString: string) => {
    return `${timeString} IST`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p>Loading your availability...</p>
      </div>
    );
  }

  if (displayAvailabilities.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Availability Set</h3>
        <p className="text-muted-foreground">
          Create your availability schedule using the forms above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayAvailabilities.map((availability) => (
        <Card key={availability.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {availability.subject?.name || "General Session"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={availability.session_type === 'individual' ? 'default' : 'secondary'}>
                  {availability.session_type}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAvailability(availability.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDateIST(availability.available_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTimeIST(availability.start_time)} - {formatTimeIST(availability.end_time)}</span>
              </div>
              {availability.session_type === 'live_course' && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Max {availability.max_students} students</span>
                </div>
              )}
            </div>
            {availability.price && (
              <div className="mt-3 pt-3 border-t">
                <span className="font-semibold">Price: ₹{availability.price}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
