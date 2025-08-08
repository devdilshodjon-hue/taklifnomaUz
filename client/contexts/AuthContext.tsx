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
    console.error("useAuth called outside of AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("AuthProvider rendering with state:", { user: !!user, profile: !!profile, loading });

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Test database connection first
        const testDatabaseConnection = async () => {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("count")
              .limit(1);
            if (error) {
              console.warn("Database connection test failed:", {
                error: error,
                message: error?.message,
                hint: error?.hint,
                details: error?.details,
              });
            } else {
              console.log("Database connection test successful");
            }
          } catch (err) {
            console.warn("Database connection test error:", err);
          }
        };

        await testDatabaseConnection();

        // Get initial session and validate it
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Session error on load:", error);
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (session) {
          // Validate session by refreshing it
          const {
            data: { session: refreshedSession },
            error: refreshError,
          } = await supabase.auth.refreshSession();

          if (!mounted) return;

          if (refreshError || !refreshedSession) {
            console.log("Session invalid, signing out...");
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }

          setSession(refreshedSession);
          setUser(refreshedSession.user);
          loadProfile(refreshedSession.user.id);
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state changed:", event, session?.user?.id);

      try {
        // Handle different auth events
        if (event === "SIGNED_OUT" || (event === "TOKEN_REFRESHED" && !session)) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          setSession(session);
          setUser(session?.user ?? null);

          if (session?.user) {
            await loadProfile(session.user.id);
          } else {
            setProfile(null);
            setLoading(false);
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        if (mounted) {
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Add session recovery on window focus
  useEffect(() => {
    const handleWindowFocus = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        // Session is invalid, sign out
        if (user) {
          console.log("Session lost on focus, signing out...");
          await supabase.auth.signOut();
        }
        return;
      }

      // Session exists but user state is lost, restore it
      if (session && !user) {
        console.log("Restoring session on focus...");
        setSession(session);
        setUser(session.user);
        if (session.user && !profile) {
          loadProfile(session.user.id);
        }
      }
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => window.removeEventListener("focus", handleWindowFocus);
  }, [user, profile]);

  const loadProfile = async (userId: string) => {
    let timeoutId: NodeJS.Timeout;
    try {
      setLoading(true);

      // Set a timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        console.log("Profile loading timeout, stopping...");
        setLoading(false);
        // Try to create a minimal profile if timeout occurs
        if (session?.user) {
          setProfile({
            id: session.user.id,
            email: session.user.email || "",
            first_name: session.user.user_metadata?.first_name || null,
            last_name: session.user.user_metadata?.last_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
          });
        }
      }, 5000); // Reduced to 5 seconds

      // Use the current session instead of fetching again
      const currentSession = await supabase.auth.getSession();
      if (!currentSession.data.session) {
        console.log("No session found");
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
          console.log(
            "Profile not found, creating new profile for user:",
            userId,
          );

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
                profileData: newProfile,
              });

              // Try to set a minimal profile object for the app to continue working
              setProfile({
                id: userId,
                email: user.user.email || "",
                first_name: user.user.user_metadata?.first_name || null,
                last_name: user.user.user_metadata?.last_name || null,
                avatar_url: user.user.user_metadata?.avatar_url || null,
                created_at: new Date().toISOString(),
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
            code: error?.code,
          });

          // Handle 406 and other session-related errors by signing out
          if (
            error?.message?.includes("406") ||
            error?.code === "PGRST301" ||
            error?.message?.includes("JWT")
          ) {
            console.log("Session-related error detected, signing out...");
            await supabase.auth.signOut();
            setProfile(null);
            setSession(null);
            setUser(null);
          } else {
            // For other RLS errors, set profile to null but don't break auth
            setProfile(null);
          }
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in loadProfile:", {
        error: error,
        message: error?.message,
        stack: error?.stack,
      });
      setProfile(null);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
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
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error("Google OAuth error:", error);
      }

      return { error };
    } catch (err) {
      console.error("Google sign-in error:", err);
      return { error: err as any };
    }
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

  console.log("AuthProvider providing value:", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
