
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import SessionRequestList from "./SessionRequestList";
import { useTeacherProfile } from "@/hooks/use-teacher-data";

// Form schema validation
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  message: z.string().optional(),
  courseId: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  duration: z.coerce
    .number()
    .min(30, "Session must be at least 30 minutes")
    .max(180, "Session cannot exceed 3 hours"),
});

const SessionRequestForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"select-teacher" | "request-form">("select-teacher");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  
  const { data: teacherProfile } = useTeacherProfile(selectedTeacherId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      courseId: undefined,
      duration: 60,
    },
  });

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setStep("request-form");
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !selectedTeacherId) return;

    setIsLoading(true);
    try {
      // Create session request in Supabase
      const { error } = await supabase.from("session_requests").insert({
        proposed_title: values.title,
        request_message: values.message,
        student_id: user.id,
        teacher_id: selectedTeacherId,
        course_id: values.courseId || null,
        proposed_date: values.date.toISOString(),
        proposed_duration: values.duration,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your session request has been sent to the teacher.",
      });

      // Reset form
      form.reset();
      setStep("select-teacher");
      setSelectedTeacherId("");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Back to teacher selection
  const handleBackToTeachers = () => {
    setStep("select-teacher");
    setSelectedTeacherId("");
  };

  return (
    <Card className="p-6">
      {step === "select-teacher" ? (
        <SessionRequestList onSelectTeacher={handleSelectTeacher} />
      ) : (
        <div>
          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              type="button"
              onClick={handleBackToTeachers}
              className="mr-4"
            >
              Back to Teachers
            </Button>
            {teacherProfile && (
              <div>
                <h3 className="text-lg font-medium">
                  Request Session with {teacherProfile.first_name} {teacherProfile.last_name}
                </h3>
              </div>
            )}
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-2xl"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter session title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message to Teacher (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what you'd like to cover in this session"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`pl-3 text-left font-normal ${
                                !field.value && "text-muted-foreground"
                              }`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() ||
                              date >
                                new Date(
                                  new Date().setMonth(new Date().getMonth() + 3)
                                )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Choose a date for your session.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="90">1.5 hours</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select how long you need with the teacher.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Request Session"}
              </Button>
            </form>
          </Form>
        </div>
      )}
    </Card>
  );
};

export default SessionRequestForm;
