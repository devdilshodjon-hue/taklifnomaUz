import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string },
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Test database connection first
    const testDatabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("count").limit(1);
        if (error) {
          console.warn("Database connection test failed:", {
            error: error,
            message: error?.message,
            hint: error?.hint,
            details: error?.details
          });
        } else {
          console.log("Database connection test successful");
        }
      } catch (err) {
        console.warn("Database connection test error:", err);
      }
    };

    testDatabaseConnection();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      setLoading(true);

      // First check if we have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116" || error.code === "PGRST301") {
          // Profile doesn't exist, create one
          console.log("Profile not found, creating new profile for user:", userId);

          const { data: user } = await supabase.auth.getUser();
          if (user.user) {
            const newProfile = {
              id: userId,
              email: user.user.email || "",
              first_name: user.user.user_metadata?.first_name || null,
              last_name: user.user.user_metadata?.last_name || null,
              avatar_url: user.user.user_metadata?.avatar_url || null,
            };

            console.log("Creating profile with data:", newProfile);

            const { data: createdProfile, error: createError } = await supabase
              .from("profiles")
              .insert(newProfile)
              .select()
              .single();

            if (!createError && createdProfile) {
              console.log("Profile created successfully:", createdProfile);
              setProfile(createdProfile);
            } else {
              console.error("Error creating profile:", {
                error: createError,
                message: createError?.message,
                details: createError?.details,
                hint: createError?.hint,
                code: createError?.code,
                profileData: newProfile
              });

              // Try to set a minimal profile object for the app to continue working
              setProfile({
                id: userId,
                email: user.user.email || "",
                first_name: user.user.user_metadata?.first_name || null,
                last_name: user.user.user_metadata?.last_name || null,
                avatar_url: user.user.user_metadata?.avatar_url || null,
                created_at: new Date().toISOString()
              });
            }
          } else {
            console.error("No user data available for profile creation");
            setProfile(null);
          }
        } else {
          console.error("Error loading profile:", {
            error: error,
            message: error?.message,
            details: error?.details,
            hint: error?.hint,
            code: error?.code
          });
          // For RLS errors or other issues, set profile to null but don't break auth
          setProfile(null);
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in loadProfile:", {
        error: error,
        message: error?.message,
        stack: error?.stack
      });
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string },
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    }

    return { error };
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
