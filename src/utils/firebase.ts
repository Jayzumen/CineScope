import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
let services:
  | { auth: ReturnType<typeof getAuth>; db: ReturnType<typeof getFirestore> }
  | undefined;
declare global {
  interface Window {
    __cinescopeFirebaseEmulators?: boolean;
  }
}
export function getFirebase() {
  if (services) return services;
  if (typeof window === "undefined") return null;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  if (!apiKey || !projectId || !appId) return null;
  const app =
    getApps()[0] ??
    initializeApp({
      apiKey,
      projectId,
      appId,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    });
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY;
  if (siteKey)
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  const auth = getAuth(app);
  const db = getFirestore(app);
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "1" &&
    !window.__cinescopeFirebaseEmulators
  ) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, "127.0.0.1", 8085);
    window.__cinescopeFirebaseEmulators = true;
  }
  services = { auth, db };
  return services;
}
