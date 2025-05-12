
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Initialize Resend with proper error handling for the API key
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface OTPRequest {
  email: string;
  name?: string;
  type: "signup" | "password-reset";
  otp?: string; // Allow OTP to be sent from the client
}

interface ScheduleNotificationRequest {
  teacherEmail: string;
  teacherName: string;
  studentEmail: string;
  studentName: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  sessionLink: string;
  additionalInfo?: string;
}

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Resend API key is properly configured
    if (!resend) {
      throw new Error("Resend API key is not configured. Please set the RESEND_API_KEY environment variable.");
    }
    
    console.log("Request URL:", req.url);
    const body = await req.text();
    console.log("Request body:", body);
    
    let requestData;
    try {
      requestData = JSON.parse(body);
      console.log("Parsed request data:", requestData);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      throw new Error(`Failed to parse request data: ${e.message}`);
    }
    
    const { email, name, type, otp: clientOtp } = requestData;
    
    if (!email) {
      throw new Error("Email address is required");
    }
    
    console.log("Processing request for email:", email, "type:", type);
    
    // Use provided OTP or generate a new one
    const otp = clientOtp || generateOTP();
    console.log("Using OTP:", otp);
    
    // For demonstration, we'll just send the OTP via email
    const subject = type === "signup" 
      ? "Verify your etutorss account" 
      : "Reset your etutorss password";
    
    const html = type === "signup"
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9933;">Welcome to etutorss!</h2>
          <p>Hello ${name || "there"},</p>
          <p>Thank you for signing up. To complete your registration, please verify your account using the following OTP code:</p>
          <h3 style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Best regards,<br>The etutorss Team</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9933;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Please use the following OTP code to proceed with the password reset:</p>
          <h3 style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 24px; letter-spacing: 5px;">${otp}</h3>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Best regards,<br>The etutorss Team</p>
        </div>
      `;
    
    try {
      console.log("Sending email to:", email);
      const emailResponse = await resend.emails.send({
        from: "etutorss <info@etutorss.com>",
        to: [email],
        subject: subject,
        html: html,
      });
      
      console.log("Email sent:", emailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Email sent successfully"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
