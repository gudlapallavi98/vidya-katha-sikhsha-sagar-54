
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
import { calculatePricing, createPaymentRecord, formatCurrency } from "@/utils/pricingUtils";

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

  // Get teacher rate and calculate pricing
  const teacherRate = type === 'individual' 
    ? (availability.price || availability.teacher_rate || 100)
    : (availability.price || availability.teacher_rate || 500);
  
  const pricing = calculatePricing(teacherRate);

  // Format date and time for IST
  const formatDateTimeIST = (dateStr: string, timeStr?: string) => {
    try {
      if (type === 'individual' && dateStr && timeStr) {
        // For individual sessions, combine date and time
        const dateTime = new Date(`${dateStr}T${timeStr}:00`);
        return dateTime.toISOString();
      } else {
        // For course enrollment, use current time
        return new Date().toISOString();
      }
    } catch (error) {
      console.error("Error formatting date time:", error);
      return new Date().toISOString();
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
        user: user.id,
        teacherId,
        availability,
        type,
        pricing
      });

      // Create proper date object for IST timezone
      const proposedDate = formatDateTimeIST(
        availability.available_date,
        availability.start_time
      );

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
        payment_amount: pricing.studentAmount,
        payment_status: "completed",
        session_type: type,
        priority_level: "normal"
      };

      console.log("Session data to insert:", sessionData);

      // Insert session request
      const { data: sessionRequest, error } = await supabase
        .from("session_requests")
        .insert(sessionData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Session request created successfully:", sessionRequest);

      // Create payment record
      try {
        await createPaymentRecord(
          user.id,
          sessionRequest.id,
          null,
          pricing,
          'student_payment',
          'completed'
        );
        console.log("Payment record created successfully");
      } catch (paymentError) {
        console.error("Error creating payment record:", paymentError);
        // Don't fail the entire flow if payment record creation fails
      }

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

  // Format display date for IST
  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      return dateStr;
    }
  };

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
                    {formatDisplayDate(availability.available_date)}
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
            <div className="col-span-2">
              <span className="font-medium">Payment Details:</span>
              <div className="mt-2 bg-green-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span>Teacher Rate:</span>
                  <span>{formatCurrency(pricing.teacherRate)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform Fee (10%):</span>
                  <span>+{formatCurrency(pricing.platformFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-green-600 border-t pt-2 mt-2">
                  <span>Amount Paid:</span>
                  <span>{formatCurrency(pricing.studentAmount)} ✓ Paid</span>
                </div>
              </div>
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
