import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "CineScope | Login",
  description: "Login page",
};

export default async function LoginPage() {
  return (
    <main className="mx-auto flex max-w-[1000px] flex-col justify-center gap-4 py-10 md:px-10">
      <h1 className="text-center text-4xl font-semibold underline">Log in</h1>
      <LoginForm />
    </main>
  );
}
