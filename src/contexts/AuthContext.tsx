
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

// Extend the User type to include custom properties
export interface ExtendedUser extends User {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile to get role and other data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data && user) {
        // Update the user with profile data
        const updatedUser: ExtendedUser = { 
          ...user, 
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          avatar_url: data.avatar_url
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Setup auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event, newSession ? "session exists" : "no session");
      
      if (!mounted) return;
      
      setSession(newSession);
      
      // Cast the user to our extended type and set metadata properties
      if (newSession?.user) {
        const extendedUser: ExtendedUser = {
          ...newSession.user,
          first_name: newSession.user.user_metadata?.first_name,
          last_name: newSession.user.user_metadata?.last_name,
          avatar_url: newSession.user.user_metadata?.avatar_url,
          role: newSession.user.user_metadata?.role
        };
        setUser(extendedUser);
        
        // Use setTimeout to avoid potential deadlock
        if (mounted) {
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(newSession.user.id);
            }
          }, 0);
        }
      } else {
        setUser(null);
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession ? "session exists" : "no session");
      
      if (!mounted) return;
      
      setSession(currentSession);
      
      // Cast the user to our extended type and set metadata properties
      if (currentSession?.user) {
        const extendedUser: ExtendedUser = {
          ...currentSession.user,
          first_name: currentSession.user.user_metadata?.first_name,
          last_name: currentSession.user.user_metadata?.last_name,
          avatar_url: currentSession.user.user_metadata?.avatar_url,
          role: currentSession.user.user_metadata?.role
        };
        setUser(extendedUser);
        
        // Use setTimeout to avoid potential deadlock
        if (mounted) {
          setTimeout(() => {
            if (mounted) {
              fetchUserProfile(currentSession.user.id);
            }
          }, 0);
        }
      } else {
        setUser(null);
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });

      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Password update failed",
        description: error instanceof Error ? error.message : "Something went wrong"
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signOut,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
