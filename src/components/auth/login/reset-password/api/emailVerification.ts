
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies if an email exists in the profiles table
 */
export const verifyEmailExists = async (email: string) => {
  try {
    // Simplified query that avoids the deep type instantiation
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1)
      .maybeSingle();
    
    if (error) {
      throw new Error("Failed to verify email");
    }
    
    return { exists: !!data, profileData: data };
  } catch (error) {
    console.error("Error checking email:", error);
    // If error is "No rows matched the query" it means the email doesn't exist
    if (error instanceof Error && error.message.includes("No rows matched")) {
      return { exists: false, profileData: null };
    }
    throw new Error("Failed to verify email");
  }
};

/**
 * Sends OTP to the user's email for password reset
 */
export const sendOtpToEmail = async (email: string) => {
  const otpResponse = await fetch(
    "https://nxdsszdobgbikrnqqrue.functions.supabase.co/send-email/send-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        type: "password-reset"
      }),
    }
  );
  
  if (!otpResponse.ok) {
    const errorData = await otpResponse.json();
    throw new Error(errorData.error || "Failed to send OTP");
  }
  
  return otpResponse.json();
};

/**
 * Sends password reset email via Supabase Auth
 */
export const sendPasswordResetEmail = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(
    email,
    { redirectTo: `${window.location.origin}/login` }
  );
  
  if (error) throw error;
};
