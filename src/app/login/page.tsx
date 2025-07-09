import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "CineScope | Login",
  description: "Login to your CineScope account",
};

export default async function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-purple-600/20"></div>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
          <div className="animate-fade-in w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="mb-4 bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-5xl">
                Welcome Back
              </h1>
              <p className="mx-auto max-w-md text-lg leading-relaxed text-slate-300">
                Sign in to your CineScope account and continue exploring the
                world of cinema
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
