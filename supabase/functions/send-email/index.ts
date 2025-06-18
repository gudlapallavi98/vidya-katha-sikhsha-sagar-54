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

interface DisputeNotificationRequest {
  sessionId: string;
  sessionTitle: string;
  disputeReason: string;
  reporterEmail: string;
  reporterType: 'teacher' | 'student';
  otherPartyName: string;
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
    
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();
    
    if (path === "send-otp") {
      const { email, name, type }: OTPRequest = await req.json();
      
      // Generate a 6-digit OTP
      const otp = generateOTP();
      
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
        const emailResponse = await resend.emails.send({
          from: "etutorss <info@etutorss.com>",
          to: [email],
          subject: subject,
          html: html,
        });
        
        console.log("Email sent:", emailResponse);
        
        // For our implementation, we'll return the OTP for client-side verification
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "OTP sent successfully", 
            otp: otp
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
    }
    
    else if (path === "schedule-notification") {
      const {
        teacherEmail,
        teacherName,
        studentEmail,
        studentName,
        sessionTitle,
        sessionDate,
        sessionTime,
        sessionLink,
        additionalInfo
      }: ScheduleNotificationRequest = await req.json();
      
      // Send email to teacher
      const teacherHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9933;">Session Scheduled: ${sessionTitle}</h2>
          <p>Hello ${teacherName},</p>
          <p>A session has been confirmed with student ${studentName}.</p>
          <h3>Session Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${sessionDate}</li>
            <li><strong>Time:</strong> ${sessionTime}</li>
            <li><strong>Title:</strong> ${sessionTitle}</li>
          </ul>
          <p>Please join the session using the following link:</p>
          <p><a href="${sessionLink}" style="display: inline-block; background-color: #138808; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Session</a></p>
          ${additionalInfo ? `<p><strong>Additional Information:</strong> ${additionalInfo}</p>` : ''}
          <p>Best regards,<br>The etutorss Team</p>
        </div>
      `;
      
      // Send email to student
      const studentHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9933;">Session Confirmed: ${sessionTitle}</h2>
          <p>Hello ${studentName},</p>
          <p>Your session with ${teacherName} has been confirmed.</p>
          <h3>Session Details:</h3>
          <ul>
            <li><strong>Date:</strong> ${sessionDate}</li>
            <li><strong>Time:</strong> ${sessionTime}</li>
            <li><strong>Title:</strong> ${sessionTitle}</li>
          </ul>
          <p>Please join the session using the following link:</p>
          <p><a href="${sessionLink}" style="display: inline-block; background-color: #138808; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Session</a></p>
          ${additionalInfo ? `<p><strong>Additional Information:</strong> ${additionalInfo}</p>` : ''}
          <p>Best regards,<br>The etutorss Team</p>
        </div>
      `;
      
      // Send emails in parallel
      const [teacherEmailResponse, studentEmailResponse] = await Promise.all([
        resend.emails.send({
          from: "etutorss <info@etutorss.com>",
          to: [teacherEmail],
          subject: `Session Scheduled: ${sessionTitle}`,
          html: teacherHtml,
        }),
        resend.emails.send({
          from: "etutorss <info@etutorss.com>",
          to: [studentEmail],
          subject: `Session Confirmed: ${sessionTitle}`,
          html: studentHtml,
        })
      ]);
      
      console.log("Teacher email sent:", teacherEmailResponse);
      console.log("Student email sent:", studentEmailResponse);
      
      return new Response(
        JSON.stringify({ success: true, message: "Schedule notifications sent successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    else if (path === "dispute-notification") {
      const {
        sessionId,
        sessionTitle,
        disputeReason,
        reporterEmail,
        reporterType,
        otherPartyName
      }: DisputeNotificationRequest = await req.json();
      
      // Send dispute notification to support team
      const supportHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9933;">Session Dispute Report</h2>
          <p>A dispute has been reported for a session on the etutorss platform.</p>
          
          <h3>Dispute Details:</h3>
          <ul>
            <li><strong>Session ID:</strong> ${sessionId}</li>
            <li><strong>Session Title:</strong> ${sessionTitle}</li>
            <li><strong>Reported by:</strong> ${reporterType} (${reporterEmail})</li>
            <li><strong>Other party:</strong> ${otherPartyName}</li>
          </ul>
          
          <h3>Issue Description:</h3>
          <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${disputeReason}</p>
          
          <p>Please investigate this matter and contact both parties if necessary.</p>
          
          <p>Best regards,<br>etutorss System</p>
        </div>
      `;
      
      // Send confirmation email to the reporter
      const confirmationHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF9933;">Dispute Report Received</h2>
          <p>Dear User,</p>
          <p>We have received your dispute report regarding the session "<strong>${sessionTitle}</strong>".</p>
          
          <h3>Your Report:</h3>
          <p style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">${disputeReason}</p>
          
          <p>Our support team will review your report and get back to you within 24-48 hours.</p>
          <p>We take all disputes seriously and will work to resolve this matter fairly.</p>
          
          <p>If you have any additional information or questions, please don't hesitate to contact us.</p>
          
          <p>Thank you for your patience.</p>
          <p>Best regards,<br>The etutorss Support Team</p>
        </div>
      `;
      
      // Send emails in parallel
      const [supportEmailResponse, confirmationEmailResponse] = await Promise.all([
        resend.emails.send({
          from: "etutorss Disputes <info@etutorss.com>",
          to: ["info@etutorss.com"],
          subject: `Dispute Report: ${sessionTitle} (${sessionId})`,
          html: supportHtml,
        }),
        resend.emails.send({
          from: "etutorss Support <info@etutorss.com>",
          to: [reporterEmail],
          subject: "Dispute Report Received - etutorss",
          html: confirmationHtml,
        })
      ]);
      
      console.log("Support email sent:", supportEmailResponse);
      console.log("Confirmation email sent:", confirmationEmailResponse);
      
      return new Response(
        JSON.stringify({ success: true, message: "Dispute notifications sent successfully" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    else {
      // Generic email sending endpoint
      const { to, subject, html, from }: EmailRequest = await req.json();
      
      try {
        const emailResponse = await resend.emails.send({
          from: from || "etutorss <info@etutorss.com>",
          to,
          subject,
          html,
        });
        
        console.log("Email sent:", emailResponse);
        
        return new Response(
          JSON.stringify({ success: true, message: "Email sent successfully" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        throw new Error(`Failed to send email: ${emailError.message}`);
      }
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
