
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  firstName?: string;
  lastName?: string;
  role?: string;
  [key: string]: any;
}

interface UseSignupOTP {
  verifyOTP: (email: string, otp: string) => Promise<{ isValid: boolean; userData: UserData | null }>;
  markOTPAsUsed: (email: string, otp: string) => Promise<boolean>;
  createOTP: (email: string, userData?: UserData) => Promise<string | null>;
}

/**
 * Custom hook to handle signup OTP operations
 */
export const useSignupOTP = (): UseSignupOTP => {
  
  /**
   * Create a new OTP for signup verification
   */
  const createOTP = async (email: string, userData?: UserData): Promise<string | null> => {
    try {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in database
      const { error } = await supabase
        .from("signup_otps")
        .insert([
          { 
            email, 
            otp, 
            user_data: userData || {},
            expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes expiry
          }
        ]);
        
      if (error) {
        console.error("Error creating signup OTP:", error);
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
  const verifyOTP = async (email: string, otp: string): Promise<{ isValid: boolean; userData: UserData | null }> => {
    try {
      // Check if OTP exists and is not expired
      const { data, error } = await supabase
        .from("signup_otps")
        .select()
        .eq("email", email)
        .eq("otp", otp)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error || !data) {
        return { isValid: false, userData: null };
      }
      
      // Mark as verified
      await supabase
        .from("signup_otps")
        .update({ verified: true })
        .eq("id", data.id);
        
      return { isValid: true, userData: data.user_data };
    } catch (error) {
      console.error("Error verifying signup OTP:", error);
      return { isValid: false, userData: null };
    }
  };
  
  /**
   * Mark an OTP as used after successful signup
   */
  const markOTPAsUsed = async (email: string, otp: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("signup_otps")
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
        .from("signup_otps")
        .update({ used: true })
        .eq("id", data.id);
        
      return true;
    } catch (error) {
      console.error("Error marking signup OTP as used:", error);
      return false;
    }
  };
  
  return {
    verifyOTP,
    markOTPAsUsed,
    createOTP
  };
};

export default useSignupOTP;
