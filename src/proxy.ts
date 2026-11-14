import { NextResponse, type NextRequest } from "next/server";
export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const dev = process.env.NODE_ENV !== "production";
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const authOrigin =
    authDomain && /^[a-zA-Z0-9.-]+$/.test(authDomain)
      ? `https://${authDomain}`
      : "";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${dev ? "'unsafe-eval'" : ""} https://challenges.cloudflare.com https://www.google.com https://www.gstatic.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://image.tmdb.org https://*.googleusercontent.com",
    "font-src 'self'",
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://challenges.cloudflare.com https://www.google.com https://www.gstatic.com " +
      (dev
        ? "ws: http://127.0.0.1:8085 http://127.0.0.1:9099 ws://127.0.0.1:8085 ws://127.0.0.1:9099"
        : ""),
    `frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com https://www.google.com https://recaptcha.google.com ${authOrigin}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(!dev ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Cross-Origin-Opener-Policy",
    "same-origin-allow-popups",
  );
  if (!dev)
    response.headers.set("Strict-Transport-Security", "max-age=31536000");
  // Remember an explicitly chosen watch region for later detail pages.
  const region = request.nextUrl.searchParams.get("region")?.toUpperCase();
  if (
    region &&
    /^[A-Z]{2}$/.test(region) &&
    /^\/(movies|shows)\/\d+$/.test(request.nextUrl.pathname)
  )
    response.cookies.set("region", region, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
      secure: !dev,
    });
  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|artwork-placeholder.svg|robots.txt|sitemap.xml).*)",
  ],
};
