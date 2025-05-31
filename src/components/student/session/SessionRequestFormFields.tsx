
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { SessionDetailsCard } from "./SessionDetailsCard";
import { useSessionRequestForm } from "@/hooks/use-session-request-form";

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
  const { pricing, isLoading, submitRequest } = useSessionRequestForm({
    teacherId,
    availability,
    type,
    onSuccess
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await submitRequest(values.message || '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Session Request</h2>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      </div>

      <SessionDetailsCard 
        type={type}
        availability={availability}
        pricing={pricing}
      />

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
