
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestDetails {
  name: string;
  email: string;
  requestId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, requestId }: RequestDetails = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Send email using Supabase's built-in email service
    const { error } = await supabase.auth.admin.sendRawEmail({
      email,
      subject: `Your etutor.ss Request ID: ${requestId}`,
      html: `
        <h2>Thank you for contacting etutor.ss!</h2>
        <p>Dear ${name},</p>
        <p>We have received your inquiry and will respond to you shortly.</p>
        <p>Your request ID is: <strong>${requestId}</strong></p>
        <p>Please keep this ID for your records. If you need to follow up on this request, 
           please mention this ID to help us locate your inquiry quickly.</p>
        <p>Thank you for choosing etutor.ss for your educational needs!</p>
        <p>Best regards,<br>The etutor.ss Team</p>
      `,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Acknowledgment email sent successfully to:", email);

    return new Response(
      JSON.stringify({ success: true, message: "Acknowledgment email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-request-acknowledgment function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "An error occurred while sending the acknowledgment email" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
