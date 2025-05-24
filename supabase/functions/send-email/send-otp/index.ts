
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
    const { email, name, type }: OTPRequest = await req.json();

    if (!email || !name || !type) {
      throw new Error("Missing required fields: email, name, or type");
    }

    const otp = generateOTP();
    const subject = type === "signup" ? "Welcome to Etutorss - Verify Your Account" : "Your Login Code - Etutorss";
    
    const emailContent = type === "signup" 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to Etutorss!</h1>
          <p>Hello ${name},</p>
          <p>Thank you for signing up with Etutorss. Please use the following verification code to complete your registration:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #1f2937; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h2>
          </div>
          <p>This code will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>Best regards,<br>The Etutorss Team</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Your Login Code</h1>
          <p>Hello ${name},</p>
          <p>Here's your login verification code:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h2 style="color: #1f2937; font-size: 32px; letter-spacing: 4px; margin: 0;">${otp}</h2>
          </div>
          <p>This code will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this login code, please secure your account immediately.</p>
          <p>Best regards,<br>The Etutorss Team</p>
        </div>
      `;

    const emailResponse = await resend.emails.send({
      from: "Etutorss <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: emailContent,
    });

    console.log("OTP email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        otp: otp, // In production, you might want to store this in database instead of returning it
        message: "OTP sent successfully" 
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
