
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
  console.log("Send email function triggered");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Resend API key is properly configured
    if (!resend) {
      console.error("Resend API key is not configured");
      throw new Error("Resend API key is not configured. Please set the RESEND_API_KEY environment variable.");
    }
    
    console.log("Request URL:", req.url);
    let body;
    try {
      body = await req.text();
      console.log("Request body:", body);
    } catch (e) {
      console.error("Failed to read request body:", e);
      throw new Error(`Failed to read request body: ${e.message}`);
    }
    
    let requestData;
    try {
      requestData = JSON.parse(body);
      console.log("Parsed request data:", requestData);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
      throw new Error(`Failed to parse request data: ${e.message}`);
    }
    
    // Check if this is a session notification request by examining the URL
    if (req.url.includes("schedule-notification")) {
      return handleScheduleNotification(requestData);
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
    } catch (emailError: any) {
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

// New function to handle session notifications
async function handleScheduleNotification(data: ScheduleNotificationRequest): Promise<Response> {
  try {
    console.log("Processing session notification for teacher:", data.teacherEmail);
    
    if (!data.teacherEmail || !data.studentEmail) {
      throw new Error("Teacher and student email addresses are required");
    }
    
    // Create email content for teacher notification
    const teacherHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF9933;">Upcoming Session Reminder</h2>
        <p>Hello ${data.teacherName},</p>
        <p>This is a reminder about your upcoming teaching session:</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #FF9933; padding: 15px; margin: 20px 0;">
          <p><strong>Session:</strong> ${data.sessionTitle}</p>
          <p><strong>Date:</strong> ${data.sessionDate}</p>
          <p><strong>Time:</strong> ${data.sessionTime}</p>
          <p><strong>Student:</strong> ${data.studentName}</p>
        </div>
        
        <p>Please join the session using the link below:</p>
        <p><a href="${data.sessionLink}" style="background-color: #FF9933; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Join Session</a></p>
        
        ${data.additionalInfo ? `<p><strong>Additional information:</strong> ${data.additionalInfo}</p>` : ''}
        
        <p>If you need to reschedule, please inform the student as soon as possible.</p>
        <p>Best regards,<br>The etutorss Team</p>
      </div>
    `;
    
    // Create email content for student notification
    const studentHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF9933;">Upcoming Session Reminder</h2>
        <p>Hello ${data.studentName},</p>
        <p>This is a reminder about your upcoming learning session:</p>
        
        <div style="background-color: #f9f9f9; border-left: 4px solid #FF9933; padding: 15px; margin: 20px 0;">
          <p><strong>Session:</strong> ${data.sessionTitle}</p>
          <p><strong>Date:</strong> ${data.sessionDate}</p>
          <p><strong>Time:</strong> ${data.sessionTime}</p>
          <p><strong>Teacher:</strong> ${data.teacherName}</p>
        </div>
        
        <p>Please join the session using the link below:</p>
        <p><a href="${data.sessionLink}" style="background-color: #FF9933; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Join Session</a></p>
        
        ${data.additionalInfo ? `<p><strong>Additional information:</strong> ${data.additionalInfo}</p>` : ''}
        
        <p>If you need to reschedule, please inform the teacher as soon as possible.</p>
        <p>Best regards,<br>The etutorss Team</p>
      </div>
    `;
    
    // Send emails to both teacher and student
    if (resend) {
      // Send to teacher
      const teacherEmailResponse = await resend.emails.send({
        from: "etutorss <info@etutorss.com>",
        to: [data.teacherEmail],
        subject: `Reminder: Upcoming Session - ${data.sessionTitle}`,
        html: teacherHtml,
      });
      
      console.log("Teacher notification email sent:", teacherEmailResponse);
      
      // Send to student
      const studentEmailResponse = await resend.emails.send({
        from: "etutorss <info@etutorss.com>",
        to: [data.studentEmail],
        subject: `Reminder: Upcoming Session - ${data.sessionTitle}`,
        html: studentHtml,
      });
      
      console.log("Student notification email sent:", studentEmailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Session notification emails sent successfully"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      throw new Error("Resend API key is not configured");
    }
  } catch (error: any) {
    console.error("Error sending session notifications:", error);
    
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
}

serve(handler);
