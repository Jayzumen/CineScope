"use client";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
type Widget = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Widget;
  }
}
export default function Turnstile({
  nonce,
  onToken,
}: {
  nonce?: string;
  onToken: (token: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const render = useCallback(() => {
    if (!ref.current || !window.turnstile || widget.current) return;
    widget.current = window.turnstile.render(ref.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      action: "search",
      theme: "dark",
      callback: (token: string) => onToken(token),
      "expired-callback": () => setError("Verification expired. Try again."),
      "error-callback": () =>
        setError(
          "Verification could not load. Check your connection or try again later.",
        ),
    });
  }, [onToken]);
  useEffect(() => {
    render();
    return () => {
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = undefined;
    };
  }, [render, attempt]);
  return (
    <div className="my-6">
      <p className="muted mb-3 text-sm">
        A quick verification helps keep discovery available to everyone.
      </p>
      <Script
        nonce={nonce}
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onReady={render}
        onError={() =>
          setError("Verification is unavailable. Please try again later.")
        }
      />
      <div ref={ref} />
      {error && (
        <p role="alert" className="alert">
          {error}
        </p>
      )}
      <button
        className="text-link"
        onClick={() => {
          setError("");
          setAttempt((x) => x + 1);
        }}
      >
        Restart verification
      </button>
    </div>
  );
}
