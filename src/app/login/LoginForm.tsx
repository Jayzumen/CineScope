"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth } from "@/utils/firebase";
import { githubProvider, googleProvider } from "@/utils/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        toast.success("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password,
        );
        toast.success("Logged in successfully!");
      }
      router.push("/account");
    } catch (error: any) {
      console.error("Auth error:", error);
      let errorMessage = "Authentication failed. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (
    provider: "google" | "github",
    providerFunction: () => Promise<any>,
  ) => {
    setIsLoading(true);
    setLoadingProvider(provider);

    try {
      await providerFunction();
      toast.success("Logged in successfully!");
      router.push("/account");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.code === "auth/popup-closed-by-user"
          ? "Login cancelled"
          : "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const logInWithGoogle = async () => {
    await handleLogin("google", () => signInWithPopup(auth, googleProvider));
  };

  const logInWithGithub = async () => {
    await handleLogin("github", () => signInWithPopup(auth, githubProvider));
  };

  const testLogin = () => {
    setFormData({
      email: "test@cinescope.com",
      password: "test123456",
    });
  };

  return (
    <Card className="w-full border-slate-700 bg-slate-800/50 shadow-2xl backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Email/Password Form */}
          <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="border-slate-600 bg-slate-700 pl-10 text-white placeholder:text-slate-400 focus:border-sky-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="border-slate-600 bg-slate-700 pr-10 pl-10 text-white placeholder:text-slate-400 focus:border-sky-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 transform text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full bg-sky-600 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {isLoading
                ? "Signing in..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </Button>

            {/* Test Login Button */}
            <Button
              type="button"
              onClick={testLogin}
              variant="outline"
              className="h-10 w-full border-slate-600 bg-slate-700 text-sm text-slate-300 hover:bg-slate-600"
            >
              Fill Test Credentials
            </Button>
          </form>

          {/* Toggle Sign Up/In */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-sky-400 underline hover:text-sky-300"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-slate-800/50 px-4 text-slate-400">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              disabled={isLoading}
              onClick={logInWithGithub}
              className="group h-12 w-full border-slate-600 bg-slate-700 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-lg"
            >
              {loadingProvider === "github" ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <FaGithub className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
              )}
              {loadingProvider === "github"
                ? "Signing in..."
                : "Continue with GitHub"}
            </Button>

            <Button
              type="button"
              disabled={isLoading}
              onClick={logInWithGoogle}
              className="group h-12 w-full border-slate-600 bg-slate-700 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-600 hover:shadow-lg"
            >
              {loadingProvider === "google" ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <FcGoogle className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
              )}
              {loadingProvider === "google"
                ? "Signing in..."
                : "Continue with Google"}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              By signing in, you agree to our terms of service and privacy
              policy
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
