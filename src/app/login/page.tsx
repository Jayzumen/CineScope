import LoginForm from "./LoginForm";
import { safeReturnPath } from "@/lib/catalogValidation";
export const metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <div className="auth-page">
      <p className="eyebrow">Your next chapter</p>
      <div className="page-top !pt-0">
        <h1>Welcome to CineScope.</h1>
        <p>Your watchlist, favorites, and discoveries. All in one place.</p>
      </div>
      <LoginForm destination={safeReturnPath((await searchParams).next)} />
    </div>
  );
}
