import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { connectAccount, disconnectAccount } from "@/lib/progress";

type AuthState = { user: User | null; ready: boolean };
const AuthContext = createContext<AuthState>({ user: null, ready: false });

// The app's single auth listener. Mounted once in the root route.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, ready: false });

  useEffect(() => {
    let currentId: string | null = null;
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user ?? null;
      setState({ user, ready: true });
      if (user && user.id !== currentId) {
        currentId = user.id;
        // Deferred: calling the database inside this callback can deadlock the auth client.
        setTimeout(() => void connectAccount(user.id), 0);
      } else if (!user && event === "SIGNED_OUT") {
        currentId = null;
        disconnectAccount();
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
