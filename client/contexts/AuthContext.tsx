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
  isInitialized: boolean;
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
    // Return a safe default instead of throwing to prevent app crashes
    return {
      user: null,
      profile: null,
      session: null,
      loading: false,
      isInitialized: false,
      signUp: async () => ({ error: new Error("Auth not available") }),
      signIn: async () => ({ error: new Error("Auth not available") }),
      signInWithGoogle: async () => ({ error: new Error("Auth not available") }),
      signOut: async () => ({ error: new Error("Auth not available") }),
      updateProfile: async () => ({ error: new Error("Auth not available") }),
    };
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  console.log("AuthProvider rendering with state:", {
    user: !!user,
    profile: !!profile,
    loading,
  });

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
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Session error on load:", error);
          // Clear any stored session data
          await supabase.auth.signOut();
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (session) {
          console.log("Session found, validating...");

          // Check if session is expired
          const now = Math.floor(Date.now() / 1000);
          if (session.expires_at && session.expires_at < now) {
            console.log("Session expired, attempting refresh...");

            // Try to refresh the session
            const {
              data: { session: refreshedSession },
              error: refreshError,
            } = await supabase.auth.refreshSession();

            if (!mounted) return;

            if (refreshError || !refreshedSession) {
              console.log("Session refresh failed, signing out...");
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              setProfile(null);
              setLoading(false);
              return;
            }

            console.log("Session refreshed successfully");
            setSession(refreshedSession);
            setUser(refreshedSession.user);
            await loadProfile(refreshedSession.user.id);
          } else {
            console.log("Session is valid");
            setSession(session);
            setUser(session.user);
            await loadProfile(session.user.id);
          }
        } else {
          console.log("No session found");
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
          setIsInitialized(true);
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
        if (event === "SIGNED_OUT") {
          console.log("User signed out");
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (event === "TOKEN_REFRESHED") {
          if (!session) {
            console.log("Token refresh failed, signing out");
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }

          console.log("Token refreshed successfully");
          setSession(session);
          setUser(session.user);

          // Only reload profile if we don't have one or if user changed
          if (!profile || profile.id !== session.user.id) {
            await loadProfile(session.user.id);
          } else {
            setLoading(false);
          }
          return;
        }

        if (event === "SIGNED_IN") {
          console.log("User signed in");

          // Validate the session
          if (!session || !session.user) {
            console.error("Invalid session on sign in");
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            return;
          }

          setSession(session);
          setUser(session.user);
          await loadProfile(session.user.id);
          return;
        }

        // For other events, just update the session
        console.log("Other auth event:", event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && session.user.id !== profile?.id) {
          await loadProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        if (mounted) {
          // On error, clear everything and sign out
          await supabase.auth.signOut();
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
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error on focus:", error);
          if (user) {
            console.log("Session error on focus, signing out...");
            await supabase.auth.signOut();
          }
          return;
        }

        if (!session) {
          // No session but we think user is logged in, sign out
          if (user) {
            console.log("No session on focus but user exists, signing out...");
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
          return;
        }

        // Check if session is expired
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at < now) {
          console.log("Session expired on focus");
          if (user) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
          return;
        }

        // Session exists and is valid, restore if needed
        if (session && !user) {
          console.log("Restoring valid session on focus...");
          setSession(session);
          setUser(session.user);
          if (session.user && !profile) {
            await loadProfile(session.user.id);
          }
        } else if (session && user && session.user.id !== user.id) {
          // Different user, update
          console.log("Different user detected on focus, updating...");
          setSession(session);
          setUser(session.user);
          await loadProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error in window focus handler:", error);
      }
    };

    // Add a debounce to avoid too many calls
    let focusTimeout: NodeJS.Timeout;
    const debouncedFocusHandler = () => {
      clearTimeout(focusTimeout);
      focusTimeout = setTimeout(handleWindowFocus, 500);
    };

    window.addEventListener("focus", debouncedFocusHandler);
    return () => {
      window.removeEventListener("focus", debouncedFocusHandler);
      clearTimeout(focusTimeout);
    };
  }, [user, profile]);

  const createUserProfile = async (user: User) => {
    const newProfile = {
      id: user.id,
      email: user.email || "",
      first_name: user.user_metadata?.first_name || null,
      last_name: user.user_metadata?.last_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    };

    console.log("Creating profile with data:", newProfile);

    const { data: createdProfile, error: createError } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select()
      .single();

    if (!createError && createdProfile) {
      console.log("Profile created successfully:", createdProfile);
      return createdProfile;
    } else {
      console.error(
        "Error creating profile:",
        createError?.message || createError,
        {
          error: createError,
          message: createError?.message,
          details: createError?.details,
          hint: createError?.hint,
          code: createError?.code,
          profileData: newProfile,
        },
      );

      // Return a minimal profile object for the app to continue working
      return {
        id: user.id,
        email: user.email || "",
        first_name: user.user_metadata?.first_name || null,
        last_name: user.user_metadata?.last_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: new Date().toISOString(),
      };
    }
  };

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
      }, 8000); // Extended timeout

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

          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const newProfile = await createUserProfile(userData.user);
            setProfile(newProfile);
          } else {
            console.error("No user data available for profile creation");
            setProfile(null);
          }
        } else {
          console.error("Error loading profile:", error?.message || error, {
            error: error,
            message: error?.message,
            details: error?.details,
            hint: error?.hint,
            code: error?.code,
          });

          // Handle session-related errors by signing out
          if (
            error?.message?.includes("406") ||
            error?.code === "PGRST301" ||
            error?.message?.includes("JWT") ||
            error?.message?.includes("auth")
          ) {
            console.log("Session-related error detected, signing out...");
            await supabase.auth.signOut();
            setProfile(null);
            setSession(null);
            setUser(null);
          } else {
            // For other RLS errors, try to create a profile anyway
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
              const newProfile = await createUserProfile(userData.user);
              setProfile(newProfile);
            } else {
              setProfile(null);
            }
          }
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error in loadProfile:", error?.message || error, {
        error: error,
        message: error?.message,
        stack: error?.stack,
      });

      // Try to create a profile as fallback
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const newProfile = await createUserProfile(userData.user);
          setProfile(newProfile);
        } else {
          setProfile(null);
        }
      } catch (fallbackError) {
        console.error(
          "Fallback profile creation failed:",
          fallbackError?.message || fallbackError,
        );
        setProfile(null);
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setLoading(false);
      setIsInitialized(true);
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
    isInitialized,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  console.log("AuthProvider providing value:", value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
