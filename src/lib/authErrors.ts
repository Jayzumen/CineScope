// Maps Firebase Auth error codes to messages a person can act on.
// Returns null when the user cancelled on purpose and nothing should be shown.
export type AuthMode = "login" | "signup" | "reset";
const cancelled = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/user-cancelled",
]);
const messages: Record<string, string> = {
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/invalid-login-credentials": "Email or password is incorrect.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/user-not-found": "Email or password is incorrect.",
  "auth/email-already-in-use":
    "An account with this email already exists. Sign in instead, or reset your password.",
  "auth/weak-password": "Choose a stronger password of at least 8 characters.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-password": "Enter your password.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/too-many-requests":
    "Too many attempts. Wait a few minutes, or reset your password.",
  "auth/network-request-failed":
    "Could not connect. Check your connection and try again.",
  "auth/popup-blocked":
    "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
  "auth/account-exists-with-different-credential":
    "This email already uses a different sign-in method. Continue with the method you used before.",
  "auth/operation-not-allowed": "This sign-in method is not available yet.",
  "auth/unauthorized-domain": "Sign-in is not available on this address yet.",
};
export function authErrorMessage(
  error: unknown,
  mode: AuthMode,
): string | null {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  if (cancelled.has(code)) return null;
  // Never reveal whether an address is registered when resetting a password.
  if (mode === "reset" && code === "auth/user-not-found") return null;
  return (
    messages[code] ??
    (mode === "reset"
      ? "Could not send a reset link. Please try again later."
      : "Could not sign in. Check your details or try another sign-in method.")
  );
}
