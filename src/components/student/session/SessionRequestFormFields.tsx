
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

      const sessionData = {
        student_id: user.id,
        teacher_id: teacherId,
        proposed_title: type === 'individual' 
          ? `${availability.subject?.name || 'Session'} - Individual Session` 
          : availability.title || 'Course Session',
        request_message: values.message || '',
        proposed_date: type === 'individual' 
          ? `${availability.available_date}T${availability.start_time}:00` 
          : new Date().toISOString(),
        proposed_duration: type === 'individual' 
          ? calculateDuration(availability.start_time, availability.end_time)
          : 60,
        status: "pending",
        course_id: type === 'course' ? availability.id : null,
        availability_id: type === 'individual' ? availability.id : null,
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

      toast({
        title: "Request Submitted",
        description: "Your session request has been sent successfully. You'll receive confirmation via email.",
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
                    {new Date(availability.available_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Time:</span>
                  <p className="text-sm text-muted-foreground">
                    {availability.start_time} - {availability.end_time}
                  </p>
                </div>
              </>
            )}
            <div>
              <span className="font-medium">Amount Paid:</span>
              <p className="text-sm text-muted-foreground">
                ₹{type === 'individual' ? '500' : '2000'}
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
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
