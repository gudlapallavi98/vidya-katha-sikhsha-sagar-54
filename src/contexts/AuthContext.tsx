
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  const hasSetInitialSession = useRef(false);
  const profileFetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // For preventing double profile fetches or infinite loops
  const isFetchingProfile = useRef(false);

  // Fetch user profile to get role and other data
  const fetchUserProfile = async (userId: string) => {
    if (isFetchingProfile.current) return;
    
    try {
      isFetchingProfile.current = true;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

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
    } finally {
      isFetchingProfile.current = false;
    }
  };

  useEffect(() => {
    // Clean up any existing timeout
    if (profileFetchTimeout.current) {
      clearTimeout(profileFetchTimeout.current);
    }
    
    const setupAuthListener = async () => {
      try {
        // First get current session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          
          // Cast the user to our extended type and set metadata properties
          if (currentSession.user) {
            const extendedUser: ExtendedUser = {
              ...currentSession.user,
              first_name: currentSession.user.user_metadata?.first_name,
              last_name: currentSession.user.user_metadata?.last_name,
              avatar_url: currentSession.user.user_metadata?.avatar_url,
              role: currentSession.user.user_metadata?.role
            };
            setUser(extendedUser);
            
            // Use setTimeout with ref to avoid potential issues
            profileFetchTimeout.current = setTimeout(() => {
              fetchUserProfile(currentSession.user.id);
            }, 100);
          }
        }
      } catch (error) {
        console.error("Error getting initial auth session:", error);
      } finally {
        hasSetInitialSession.current = true;
        setLoading(false);
      }
    };

    // Setup auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state changed:", event, newSession ? "session exists" : "no session");
      
      // Only process auth state changes after initial session is set
      // This prevents duplicate processing during initialization
      if (!hasSetInitialSession.current) return;
      
      setSession(newSession);
      
      if (newSession?.user) {
        const extendedUser: ExtendedUser = {
          ...newSession.user,
          first_name: newSession.user.user_metadata?.first_name,
          last_name: newSession.user.user_metadata?.last_name,
          avatar_url: newSession.user.user_metadata?.avatar_url,
          role: newSession.user.user_metadata?.role
        };
        setUser(extendedUser);
        
        // Debounce profile fetching to prevent rapid successive calls
        if (profileFetchTimeout.current) {
          clearTimeout(profileFetchTimeout.current);
        }
        
        profileFetchTimeout.current = setTimeout(() => {
          fetchUserProfile(newSession.user.id);
        }, 100);
      } else {
        setUser(null);
      }
    });

    // Initialize auth
    setupAuthListener();

    return () => {
      if (profileFetchTimeout.current) {
        clearTimeout(profileFetchTimeout.current);
      }
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
