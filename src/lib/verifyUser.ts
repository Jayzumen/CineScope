import "server-only";
import { createRemoteJWKSet, jwtVerify } from "jose";
const keys = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
  { timeoutDuration: 3000 },
);
export async function verifiedUser(authorization: string | null) {
  if (!authorization) return null;
  const project = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (
    !project ||
    !authorization.startsWith("Bearer ") ||
    authorization.length > 8192
  )
    throw new Error("Invalid identity.");
  const { payload } = await jwtVerify(authorization.slice(7), keys, {
    algorithms: ["RS256"],
    issuer: `https://securetoken.google.com/${project}`,
    audience: project,
    requiredClaims: ["exp", "iat", "auth_time", "sub"],
  });
  const now = Date.now() / 1000;
  if (
    !payload.sub ||
    payload.sub.length > 128 ||
    typeof payload.iat !== "number" ||
    payload.iat > now ||
    typeof payload.auth_time !== "number" ||
    payload.auth_time > now
  )
    throw new Error("Invalid identity.");
  return payload.sub;
}
