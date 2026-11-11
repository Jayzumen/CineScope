"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useAuth } from "@/components/AuthProvider";
export default function LoginForm({
  destination = "/account",
}: {
  destination?: string;
}) {
  const { user, services, loading, error: authError } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (user) router.replace(destination);
  }, [user, router, destination]);
  async function submit(provider?: "google" | "github") {
    if (!services || pending) return;
    setPending(true);
    setError("");
    setMessage("");
    try {
      if (provider)
        await signInWithPopup(
          services.auth,
          provider === "google"
            ? new GoogleAuthProvider()
            : new GithubAuthProvider(),
        );
      else if (mode === "reset") {
        await sendPasswordResetEmail(services.auth, email.trim());
        setMessage(
          "If an account exists for this email, a reset link is on its way.",
        );
      } else if (mode === "signup")
        await createUserWithEmailAndPassword(
          services.auth,
          email.trim(),
          password,
        );
      else
        await signInWithEmailAndPassword(services.auth, email.trim(), password);
    } catch {
      setError(
        mode === "reset"
          ? "Could not send a reset link. Please try again later."
          : "Could not sign in. Check your details or try another sign-in method.",
      );
    } finally {
      setPending(false);
    }
  }
  if (loading) return <p role="status">Preparing sign-in…</p>;
  if (authError)
    return (
      <div className="alert" role="status">
        {authError}
      </div>
    );
  return (
    <div className="auth-card">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <h2 className="section-title">
          {mode === "signup"
            ? "Create an account"
            : mode === "reset"
              ? "Reset your password"
              : "Sign in"}
        </h2>
        <label className="field">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            maxLength={254}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {mode !== "reset" && (
          <label className="field">
            Password
            <input
              required
              type="password"
              autoComplete={
                mode === "signup" ? "new-password" : "current-password"
              }
              minLength={mode === "signup" ? 8 : 1}
              maxLength={128}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}
        {error && (
          <p role="alert" className="alert">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="muted text-sm">
            {message}
          </p>
        )}
        <button className="button" disabled={pending}>
          {pending
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : mode === "reset"
                ? "Send reset link"
                : "Sign in"}
        </button>
      </form>
      <div className="mt-4 flex justify-between gap-3">
        <button
          className="text-link"
          onClick={() => {
            setMode(mode === "signup" ? "login" : "signup");
            setError("");
          }}
        >
          {mode === "signup" ? "Already a member?" : "Create an account"}
        </button>
        <button
          className="text-link"
          onClick={() => {
            setMode(mode === "reset" ? "login" : "reset");
            setError("");
          }}
        >
          {mode === "reset" ? "Back to sign in" : "Forgot password?"}
        </button>
      </div>
      <p className="auth-divider">or continue with</p>
      <div className="auth-providers">
        <button
          className="button subtle"
          disabled={pending}
          onClick={() => submit("google")}
        >
          Google
        </button>
        <button
          className="button subtle"
          disabled={pending}
          onClick={() => submit("github")}
        >
          GitHub
        </button>
      </div>
    </div>
  );
}
