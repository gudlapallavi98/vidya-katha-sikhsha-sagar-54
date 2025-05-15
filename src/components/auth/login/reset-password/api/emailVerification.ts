
import { supabase } from "@/integrations/supabase/client";

/**
 * Verifies if an email exists in the profiles table
 */
export const verifyEmailExists = async (email: string) => {
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .limit(1);
  
  if (profileError) {
    console.error("Error checking email:", profileError);
    throw new Error("Failed to verify email");
  }
  
  return { exists: profileData && profileData.length > 0, profileData };
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
