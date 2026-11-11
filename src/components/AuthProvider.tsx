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
    try {
      const services = getFirebase();
      if (!services) {
        setState({
          user: null,
          loading: false,
          services: null,
          error:
            "Account features are not available yet. You can still explore the catalog.",
        });
        return;
      }
      return onAuthStateChanged(
        services.auth,
        (user) => setState({ user, loading: false, services, error: "" }),
        () =>
          setState({
            user: null,
            loading: false,
            services,
            error:
              "Sign-in is temporarily unavailable. Please reload to retry.",
          }),
      );
    } catch {
      setState({
        user: null,
        loading: false,
        services: null,
        error: "Sign-in is temporarily unavailable. Please reload to retry.",
      });
    }
  }, []);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
