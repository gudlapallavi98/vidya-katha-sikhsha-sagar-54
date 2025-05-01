
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const useContactMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const submitContactMessage = async (formData: ContactFormData) => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.message) {
        throw new Error("Name, email and message are required fields");
      }
      
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message,
          status: 'new'
        });
        
      if (error) throw error;
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, submitContactMessage };
};
