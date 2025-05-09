
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  const submitContactMessage = async (formData: ContactFormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            subject: formData.subject || null,
            message: formData.message,
            status: 'new'
          }
        ]);
      
      if (error) throw error;
      
      // Send confirmation email
      try {
        await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [formData.email],
            subject: "Thank you for contacting etutorss",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF9933;">Thank You for Contacting Us!</h2>
                <p>Hello ${formData.name},</p>
                <p>Thank you for reaching out to etutorss. We have received your message and will get back to you as soon as possible.</p>
                <p>Here's a summary of your message:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #FF9933; margin: 20px 0;">
                  ${formData.subject ? `<p><strong>Subject:</strong> ${formData.subject}</p>` : ''}
                  <p><strong>Message:</strong> ${formData.message}</p>
                </div>
                <p>If you have any additional questions, feel free to reply to this email or call us at +91 98765 43210.</p>
                <p>Best regards,<br>The etutorss Team</p>
              </div>
            `
          })
        });
      } catch (emailError) {
        console.error("Failed to send email confirmation:", emailError);
        // Don't throw error here, we still want to show success even if email fails
      }
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll be in touch soon!",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitContactMessage
  };
};
