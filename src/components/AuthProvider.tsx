"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebase } from "@/utils/firebase";
type AuthState = {
  user: User | null;
  loading: boolean;
  services: ReturnType<typeof getFirebase>;
  error: string;
};
const Context = createContext<AuthState>({
  user: null,
  loading: true,
  services: null,
  error: "",
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    services: null,
    error: "",
  });
  useEffect(() => {
    let active = true;
    const publish = (next: AuthState) => {
      queueMicrotask(() => {
        if (active) setState(next);
      });
    };
    try {
      const services = getFirebase();
      if (!services) {
        publish({
          user: null,
          loading: false,
          services: null,
          error:
            "Account features are not available yet. You can still explore the catalog.",
        });
        return () => {
          active = false;
        };
      }
      const unsubscribe = onAuthStateChanged(
        services.auth,
        (user) => publish({ user, loading: false, services, error: "" }),
        () =>
          publish({
            user: null,
            loading: false,
            services,
            error:
              "Sign-in is temporarily unavailable. Please reload to retry.",
          }),
      );
      return () => {
        active = false;
        unsubscribe();
      };
    } catch {
      publish({
        user: null,
        loading: false,
        services: null,
        error: "Sign-in is temporarily unavailable. Please reload to retry.",
      });
      return () => {
        active = false;
      };
    }
  }, []);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
