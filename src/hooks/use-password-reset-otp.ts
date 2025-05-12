
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UsePasswordResetOTP {
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  markOTPAsUsed: (email: string, otp: string) => Promise<boolean>;
  createOTP: (email: string) => Promise<string | null>;
}

/**
 * Custom hook to handle password reset OTP operations
 */
export const usePasswordResetOTP = (): UsePasswordResetOTP => {
  
  /**
   * Create a new OTP for password reset
   */
  const createOTP = async (email: string): Promise<string | null> => {
    try {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in database
      const { error } = await supabase
        .from("password_reset_otps")
        .insert([
          { 
            email, 
            otp, 
            expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes expiry
          }
        ]);
        
      if (error) {
        console.error("Error creating OTP:", error);
        return null;
      }
      
      return otp;
    } catch (error) {
      console.error("Error in createOTP:", error);
      return null;
    }
  };
  
  /**
   * Verify if an OTP is valid for the given email
   */
  const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
    try {
      // Check if OTP exists and is not expired
      const { data, error } = await supabase
        .from("password_reset_otps")
        .select()
        .eq("email", email)
        .eq("otp", otp)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error || !data) {
        return false;
      }
      
      // Mark as verified
      await supabase
        .from("password_reset_otps")
        .update({ verified: true })
        .eq("id", data.id);
        
      return true;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false;
    }
  };
  
  /**
   * Mark an OTP as used after successful password reset
   */
  const markOTPAsUsed = async (email: string, otp: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("password_reset_otps")
        .select()
        .eq("email", email)
        .eq("otp", otp)
        .eq("verified", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error || !data) {
        return false;
      }
      
      // Mark as used
      await supabase
        .from("password_reset_otps")
        .update({ used: true })
        .eq("id", data.id);
        
      return true;
    } catch (error) {
      console.error("Error marking OTP as used:", error);
      return false;
    }
  };
  
  return {
    verifyOTP,
    markOTPAsUsed,
    createOTP
  };
};

export default usePasswordResetOTP;
