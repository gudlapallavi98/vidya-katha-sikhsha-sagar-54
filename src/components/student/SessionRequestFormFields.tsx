
import React, { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Calendar, Clock, BookOpen, MessageSquare, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { calculatePricing } from "@/utils/pricingUtils";

interface SessionRequestFormFieldsProps {
  form: UseFormReturn<any>;
  selectedTeacher: any;
  selectedAvailability: any;
  onAvailabilitySelect: (availability: any) => void;
  onBookSession: () => void;
  isLoading: boolean;
}

export const SessionRequestFormFields: React.FC<SessionRequestFormFieldsProps> = ({
  form,
  selectedTeacher,
  selectedAvailability,
  onAvailabilitySelect,
  onBookSession,
  isLoading
}) => {
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [hasAvailability, setHasAvailability] = useState(true);

  // Fetch available slots when teacher is selected
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!selectedTeacher?.id) {
        setAvailableSlots([]);
        setHasAvailability(true);
        return;
      }

      setSlotsLoading(true);
      try {
        const { data: slots, error } = await supabase
          .from('teacher_availability')
          .select(`
            *,
            subjects:subject_id (
              id,
              name,
              category
            )
          `)
          .eq('teacher_id', selectedTeacher.id)
          .eq('status', 'available')
          .gte('available_date', new Date().toISOString().split('T')[0])
          .order('available_date', { ascending: true })
          .order('start_time', { ascending: true });

        if (error) {
          console.error('Error fetching availability:', error);
          setAvailableSlots([]);
          setHasAvailability(false);
          return;
        }

        console.log('Available slots:', slots);
        setAvailableSlots(slots || []);
        setHasAvailability(slots && slots.length > 0);
      } catch (error) {
        console.error('Error fetching availability:', error);
        setAvailableSlots([]);
        setHasAvailability(false);
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedTeacher?.id]);

  const formatSlotTime = (date: string, startTime: string, endTime: string) => {
    return `${format(new Date(date), 'MMM dd, yyyy')} • ${startTime} - ${endTime}`;
  };

  const calculatePrice = (teacherRate: number) => {
    return teacherRate * 1.1; // Student pays 10% more
  };

  // Calculate pricing for selected availability
  const getPricing = () => {
    if (!selectedAvailability) return null;
    const teacherRate = selectedAvailability.teacher_rate || selectedAvailability.price || 100;
    return calculatePricing(teacherRate);
  };

  return (
    <div className="space-y-6">
      {/* Session Title */}
      <FormField
        control={form.control}
        name="proposed_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Session Title
            </FormLabel>
            <FormControl>
              <Input placeholder="e.g., Math Algebra Help" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Available Time Slots */}
      {selectedTeacher && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            {slotsLoading ? (
              <div className="text-center py-4">Loading available slots...</div>
            ) : !hasAvailability ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No slots are available with this teacher at the moment. Please try selecting a different teacher or check back later.
                </AlertDescription>
              </Alert>
            ) : availableSlots.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No slots are available with this teacher at the moment. Please try selecting a different teacher or check back later.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAvailability?.id === slot.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => onAvailabilitySelect(slot)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">
                          {formatSlotTime(slot.available_date, slot.start_time, slot.end_time)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Subject: {slot.subjects?.name || 'General'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Type: {slot.session_type === 'individual' ? 'One-on-One' : 'Group Session'}
                        </div>
                        {slot.session_type === 'group' && (
                          <div className="text-sm text-muted-foreground">
                            Spots: {slot.max_students - slot.booked_students} / {slot.max_students} available
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          ₹{calculatePrice(slot.teacher_rate || slot.price || 0)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session Duration */}
      <FormField
        control={form.control}
        name="proposed_duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Request Message */}
      <FormField
        control={form.control}
        name="request_message"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Additional Message (Optional)
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any specific requirements or topics you'd like to cover..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Session Details */}
      {selectedAvailability && getPricing() && (
        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Type:</span>
                <p className="text-sm text-muted-foreground">
                  {selectedAvailability.session_type === 'individual' ? 'Individual Session' : 'Group Session'}
                </p>
              </div>
              <div>
                <span className="font-medium">Subject:</span>
                <p className="text-sm text-muted-foreground">
                  {selectedAvailability.subjects?.name || 'General'}
                </p>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(selectedAvailability.available_date), 'EEEE, MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <span className="font-medium">Time:</span>
                <p className="text-sm text-muted-foreground">
                  {selectedAvailability.start_time} - {selectedAvailability.end_time} IST
                </p>
              </div>
              <div className="col-span-2">
                <span className="font-medium">Payment Details:</span>
                <div className="mt-2 bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Teacher Rate:</span>
                    <span>₹{getPricing()?.teacherRate}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Platform Fee (10%):</span>
                    <span>+₹{getPricing()?.platformFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-green-600 border-t pt-2 mt-2">
                    <span>Amount Paid:</span>
                    <span>₹{getPricing()?.studentAmount} ✓ Paid</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Availability Alert */}
      {!hasAvailability && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No slots are available. Please select a different teacher or check back later.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Book Session Button */}
      <Button
        type="button"
        onClick={onBookSession}
        disabled={!selectedAvailability || isLoading || !hasAvailability}
        className="w-full"
      >
        {isLoading ? "Booking Session..." : "Book Session"}
      </Button>
    </div>
  );
};
