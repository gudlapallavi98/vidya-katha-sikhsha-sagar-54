
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Book } from "lucide-react";
import { format } from "date-fns";

interface AvailabilitySlot {
  id: string;
  teacher_id: string;
  subject_id: string;
  available_date: string;
  start_time: string;
  end_time: string;
  session_type: string;
  price: number;
  teacher_rate: number;
  student_price: number;
  status: string;
  booked_students: number;
  max_students: number;
  notes?: string;
  teacher?: {
    first_name: string;
    last_name: string;
    display_name?: string;
  };
  subject?: {
    name: string;
  };
}

interface AvailabilitySelectorProps {
  subjectId?: string;
  teacherId?: string;
  onSelectSlot: (slot: AvailabilitySlot) => void;
}

const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  subjectId,
  teacherId,
  onSelectSlot,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const { data: availabilitySlots = [], isLoading } = useQuery({
    queryKey: ['teacher_availability', teacherId, subjectId],
    queryFn: async () => {
      let query = supabase
        .from('teacher_availability')
        .select(`
          *,
          teacher:profiles!teacher_availability_teacher_id_fkey(first_name, last_name, display_name),
          subject:subjects(name)
        `)
        .eq('status', 'available') // Only show available slots
        .gte('available_date', new Date().toISOString().split('T')[0]) // Future dates only
        .order('available_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      if (subjectId) {
        query = query.eq('subject_id', subjectId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as AvailabilitySlot[];
    },
    enabled: true,
  });

  // Filter out fully booked slots
  const availableSlots = availabilitySlots.filter(slot => 
    slot.status === 'available' && 
    slot.booked_students < slot.max_students
  );

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    const date = slot.available_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const filteredSlots = selectedDate 
    ? slotsByDate[selectedDate] || []
    : availableSlots;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading available slots...</div>
        </CardContent>
      </Card>
    );
  }

  const uniqueDates = Object.keys(slotsByDate).sort();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant={selectedDate === "" ? "default" : "outline"}
              onClick={() => setSelectedDate("")}
              className="text-sm"
            >
              All Dates
            </Button>
            {uniqueDates.map((date) => (
              <Button
                key={date}
                variant={selectedDate === date ? "default" : "outline"}
                onClick={() => setSelectedDate(date)}
                className="text-sm"
              >
                {format(new Date(date), 'MMM dd')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Time Slots</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSlots.length > 0 ? (
            <div className="grid gap-4">
              {filteredSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelectSlot(slot)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {format(new Date(slot.available_date), 'EEEE, MMM dd, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{slot.start_time} - {slot.end_time}</span>
                      </div>

                      {!teacherId && slot.teacher && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {slot.teacher.display_name || 
                             `${slot.teacher.first_name} ${slot.teacher.last_name}`}
                          </span>
                        </div>
                      )}

                      {!subjectId && slot.subject && (
                        <div className="flex items-center gap-2">
                          <Book className="h-4 w-4 text-muted-foreground" />
                          <span>{slot.subject.name}</span>
                        </div>
                      )}

                      <div className="text-sm text-muted-foreground">
                        {slot.session_type === 'individual' ? 'One-on-One' : 'Group'} Session
                      </div>

                      {slot.notes && (
                        <div className="text-sm text-muted-foreground">
                          Note: {slot.notes}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg">₹{slot.student_price}</div>
                      <div className="text-sm text-muted-foreground">
                        {slot.max_students - slot.booked_students} spot{slot.max_students - slot.booked_students !== 1 ? 's' : ''} left
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No available time slots found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailabilitySelector;
