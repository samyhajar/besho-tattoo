"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser-client";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

    useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user: initialUser }, error } = await supabase.auth.getUser();

        if (error) {
          // Only log auth errors if they're not about missing sessions
          if (error.message !== 'Auth session missing!' && error.message !== 'Invalid session') {
            console.error("Auth error:", error);
          }
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        setUser(initialUser);

        if (initialUser) {
          // Check if user is admin
          try {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("is_admin")
              .eq("id", initialUser.id)
              .single();

            if (profileError) {
              console.error("Profile fetch error:", profileError);
              setIsAdmin(false);
            } else {
              setIsAdmin(profile?.is_admin || false);
            }
          } catch (profileError) {
            console.error("Profile error:", profileError);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        // Only log unexpected errors, not missing auth sessions which are normal for public pages
        if (error instanceof Error && !error.message.includes('Auth session missing')) {
          console.error("Error getting initial session:", error);
        }
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    void getInitialSession();

        // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);

        const currentUser = session?.user || null;
        setUser(currentUser);

                if (currentUser) {
          // Check admin status with retry logic
          const checkAdminStatus = async (retries = 3) => {
            for (let i = 0; i < retries; i++) {
              try {
                const { data: profile, error: profileError } = await supabase
                  .from("profiles")
                  .select("is_admin")
                  .eq("id", currentUser.id)
                  .single();

                if (profileError) {
                  if (i === retries - 1) {
                    console.error("Profile fetch error after retries:", profileError);
                    setIsAdmin(false);
                    return;
                  }
                  // Wait a bit before retrying
                  await new Promise(resolve => setTimeout(resolve, 500));
                  continue;
                } else {
                  setIsAdmin(profile?.is_admin || false);
                  return;
                }
              } catch (error) {
                if (i === retries - 1) {
                  console.error("Error checking admin status after retries:", error);
                  setIsAdmin(false);
                  return;
                }
                await new Promise(resolve => setTimeout(resolve, 500));
              }
            }
          };

          void checkAdminStatus();
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signOut = async () => {
    void supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};