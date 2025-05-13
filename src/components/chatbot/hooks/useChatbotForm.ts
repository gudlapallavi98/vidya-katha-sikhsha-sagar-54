
import { useState } from "react";
import { z } from "zod";
import { FormField } from "../../types/chatbot";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  city: z.string().optional(),
  description: z.string().min(10, "Please provide more details about your query"),
});

export const useChatbotForm = (user: any, setChatbotState: (state: any) => void, addAssistantMessage: (message: string) => void) => {
  const [formValues, setFormValues] = useState<FormField>({
    name: "",
    email: "",
    phone: "",
    city: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormField, string>>>({});
  const [requestId, setRequestId] = useState<string | null>(null);
  const { toast } = useToast();

  // Pre-fill form with user data if available
  const initializeForm = () => {
    if (user?.email) {
      setFormValues(prev => ({
        ...prev,
        email: user.email || "",
        name: user?.user_metadata?.first_name 
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`
          : prev.name
      }));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (formErrors[name as keyof FormField]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFormSubmit = async () => {
    try {
      // Validate form
      const validationResult = formSchema.safeParse(formValues);
      
      if (!validationResult.success) {
        const errors: Partial<Record<keyof FormField, string>> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path[0]) {
            errors[err.path[0] as keyof FormField] = err.message;
          }
        });
        
        setFormErrors(errors);
        return;
      }
      
      // Start submission process
      setChatbotState("submitting");
      
      // Generate a request ID
      const { data: reqIdData, error: reqIdError } = await supabase.rpc('generate_request_id');
      
      if (reqIdError) {
        throw new Error(`Error generating request ID: ${reqIdError.message}`);
      }
      
      const generatedRequestId = reqIdData;
      
      // Save to database
      const { error: insertError } = await supabase
        .from('chatbot_requests')
        .insert([{ 
          request_id: generatedRequestId,
          ...formValues
        }]);
      
      if (insertError) {
        throw new Error(`Error saving request: ${insertError.message}`);
      }
      
      setRequestId(generatedRequestId);
      
      // Send acknowledgment email
      const emailResponse = await supabase.functions.invoke('send-request-acknowledgment', {
        body: JSON.stringify({
          name: formValues.name,
          email: formValues.email,
          requestId: generatedRequestId,
        }),
      });
      
      if (!emailResponse.data?.success) {
        console.warn("Email sending failed, but request was recorded", emailResponse.error);
      }
      
      // Add confirmation message
      addAssistantMessage(`Thank you, ${formValues.name}! Your request has been submitted successfully. Your request ID is: ${generatedRequestId}. We've sent a confirmation email to ${formValues.email} with these details. Our team will get back to you soon!`);
      
      setChatbotState("completed");
      
      // Reset form for future use
      setFormValues({
        name: "",
        email: user?.email || "",
        phone: "",
        city: "",
        description: "",
      });
      
      toast({
        title: "Request Submitted",
        description: `Your request ID is: ${generatedRequestId}`
      });
    } catch (error: any) {
      console.error("Form submission error:", error);
      
      // Add error message
      addAssistantMessage("I'm sorry, there was an error submitting your request. Please try again later or contact support directly at support@etutorss.com.");
      
      setChatbotState("chat");
      
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: "There was a problem submitting your request. Please try again."
      });
    }
  };

  return {
    formValues,
    formErrors,
    requestId,
    handleFormChange,
    handleFormSubmit,
    initializeForm
  };
};
