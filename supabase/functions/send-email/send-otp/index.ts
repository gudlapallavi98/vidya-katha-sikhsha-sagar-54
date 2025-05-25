
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OTPRequest {
  email: string;
  name: string;
  type: "signup" | "login";
}

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("OTP request received");
    
    const { email, name, type }: OTPRequest = await req.json();
    console.log("Request data:", { email, name, type });

    if (!email || !name || !type) {
      throw new Error("Missing required fields: email, name, or type");
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);
    
    const subject = type === "signup" ? "Welcome to Etutorss - Verify Your Account" : "Your Login Code - Etutorss";
    
    const emailContent = type === "signup" 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Welcome to Etutorss!</h1>
          </div>
          <p style="font-size: 16px; color: #333;">Hello ${name},</p>
          <p style="font-size: 16px; color: #333; line-height: 1.5;">
            Thank you for signing up with Etutorss. Please use the following verification code to complete your registration:
          </p>
          <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <h2 style="color: #1f2937; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.5;">
            This code will expire in 10 minutes for security reasons.
          </p>
          <p style="font-size: 14px; color: #666; line-height: 1.5;">
            If you didn't request this verification, please ignore this email.
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #666; margin: 0;">
              Best regards,<br>
              <strong>The Etutorss Team</strong>
            </p>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Your Login Code</h1>
          </div>
          <p style="font-size: 16px; color: #333;">Hello ${name},</p>
          <p style="font-size: 16px; color: #333; line-height: 1.5;">
            Here's your login verification code:
          </p>
          <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <h2 style="color: #1f2937; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">${otp}</h2>
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.5;">
            This code will expire in 10 minutes for security reasons.
          </p>
          <p style="font-size: 14px; color: #666; line-height: 1.5;">
            If you didn't request this login code, please secure your account immediately.
          </p>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #666; margin: 0;">
              Best regards,<br>
              <strong>The Etutorss Team</strong>
            </p>
          </div>
        </div>
      `;

    console.log("Attempting to send email...");
    
    const emailResponse = await resend.emails.send({
      from: "Etutorss <info@etutorss.com>",
      to: [email],
      subject: subject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        otp: otp,
        message: "OTP sent successfully",
        emailId: emailResponse.id
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        details: error.toString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
