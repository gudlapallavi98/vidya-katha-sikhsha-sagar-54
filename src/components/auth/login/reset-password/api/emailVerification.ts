
import { supabase } from '@/integrations/supabase/client';

// Verify if an email exists in the profiles table
export async function verifyEmailExists(email: string): Promise<{ exists: boolean }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
      
    // Alternative check directly with auth if profile doesn't have email
    if (error || !data) {
      // Since we can't directly query auth users from client side,
      // we'll rely on the profiles table only for simplicity
      return { exists: false };
    }
    
    return { exists: !!data };
  } catch (err) {
    console.error("Error verifying email:", err);
    return { exists: false };
  }
}

// Send OTP to email for password reset
export async function sendOtpToEmail(email: string): Promise<{ otp: string }> {
  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save OTP to database
    const { error } = await supabase
      .from('password_reset_otps')
      .insert([{
        email,
        otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes expiry
        used: false,
        verified: false
      }]);
      
    if (error) {
      console.error("Error saving OTP:", error);
      throw new Error("Failed to generate OTP");
    }
    
    return { otp };
  } catch (err) {
    console.error("Error sending OTP:", err);
    throw err;
  }
}

// Send password reset email through Supabase Auth
export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Error sending reset email:", error);
      throw error;
    }
  } catch (err) {
    console.error("Failed to send reset email:", err);
    throw err;
  }
}
