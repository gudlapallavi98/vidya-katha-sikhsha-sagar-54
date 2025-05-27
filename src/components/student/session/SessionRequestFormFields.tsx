
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  message: z.string().optional(),
});

interface SessionRequestFormFieldsProps {
  teacherId: string;
  availability: any;
  type: 'individual' | 'course';
  onBack: () => void;
  onSuccess: () => void;
}

export const SessionRequestFormFields: React.FC<SessionRequestFormFieldsProps> = ({
  teacherId,
  availability,
  type,
  onBack,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  };

  // Get the actual price from availability data
  const getActualPrice = () => {
    if (type === 'individual') {
      return availability.price || 500; // fallback to 500 if no price set
    } else {
      return availability.price || 0; // fallback to 0 for courses
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to submit a session request.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting session request with data:", {
        user_id: user.id,
        teacher_id: teacherId,
        availability,
        type,
        message: values.message
      });

      const actualPrice = getActualPrice();

      // Create proper date object for IST timezone
      let proposedDate;
      if (type === 'individual') {
        // Combine date and time for individual sessions
        const dateStr = availability.available_date;
        const timeStr = availability.start_time;
        proposedDate = new Date(`${dateStr}T${timeStr}:00+05:30`).toISOString();
      } else {
        // For courses, use current date
        proposedDate = new Date().toISOString();
      }

      const sessionData = {
        student_id: user.id,
        teacher_id: teacherId,
        proposed_title: type === 'individual' 
          ? `${availability.subject?.name || 'Session'} - Individual Session` 
          : availability.title || 'Course Session',
        request_message: values.message || '',
        proposed_date: proposedDate,
        proposed_duration: type === 'individual' 
          ? calculateDuration(availability.start_time, availability.end_time)
          : 60,
        status: "pending",
        course_id: type === 'course' ? availability.id : null,
        availability_id: type === 'individual' ? availability.id : null,
        payment_amount: actualPrice,
        payment_status: "completed", // Since we've already processed payment
        session_type: type,
        priority_level: "normal"
      };

      console.log("Session data to insert:", sessionData);

      const { data, error } = await supabase
        .from("session_requests")
        .insert(sessionData)
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Session request created successfully:", data);

      // Update availability status if it's an individual session
      if (type === 'individual' && availability.id) {
        const { error: updateError } = await supabase
          .from("teacher_availability")
          .update({ 
            status: "booked",
            booked_students: (availability.booked_students || 0) + 1
          })
          .eq("id", availability.id);

        if (updateError) {
          console.error("Error updating availability:", updateError);
        }
      }

      toast({
        title: "Request Submitted Successfully",
        description: "Your session request has been sent to the teacher. You'll receive confirmation via email.",
      });

      onSuccess();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const actualPrice = getActualPrice();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Session Request</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Type:</span>
              <p className="text-sm text-muted-foreground">
                {type === 'individual' ? 'Individual Session' : 'Course Enrollment'}
              </p>
            </div>
            <div>
              <span className="font-medium">Subject/Course:</span>
              <p className="text-sm text-muted-foreground">
                {type === 'individual' ? availability.subject?.name : availability.title}
              </p>
            </div>
            {type === 'individual' && (
              <>
                <div>
                  <span className="font-medium">Date:</span>
                  <p className="text-sm text-muted-foreground">
                    {new Date(availability.available_date + 'T00:00:00+05:30').toLocaleDateString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <p className="text-sm text-muted-foreground">
                    {availability.start_time} - {availability.end_time} IST
                  </p>
                </div>
              </>
            )}
            <div>
              <span className="font-medium">Amount Paid:</span>
              <p className="text-sm text-muted-foreground text-green-600 font-semibold">
                ₹{actualPrice} ✓ Paid
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={type === 'individual' 
                      ? "Any specific topics you'd like to cover in this session..."
                      : "Let the teacher know about your goals and expectations..."
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Submitting..." : "Submit Session Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
