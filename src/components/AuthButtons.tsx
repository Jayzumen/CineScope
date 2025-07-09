"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import MobileMenu from "./MobileMenu";
import { auth } from "@/utils/firebase";
import { Button } from "./ui/button";

const AuthButtons = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>("");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser("");
      router.push("/");
      toast("Logged out successfully");
    } catch (error) {
      console.log(error);
      toast("Error logging out");
    }
  };

  const getUser = async () => {
    try {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          setUser(user?.displayName || "User");
        } else {
          setIsAuthenticated(false);
          setUser("");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="hidden items-center gap-6 md:flex">
        <Link
          aria-label="Movies Page Link"
          className="group relative font-medium text-slate-300 transition-colors duration-200 hover:text-sky-400"
          href="/movies"
        >
          Movies
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-sky-400 transition-all duration-200 group-hover:w-full"></span>
        </Link>
        <Link
          aria-label="Shows Page Link"
          className="group relative font-medium text-slate-300 transition-colors duration-200 hover:text-purple-400"
          href="/shows"
        >
          TV Shows
          <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-purple-400 transition-all duration-200 group-hover:w-full"></span>
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link
              className="font-medium text-slate-300 transition-colors duration-200 hover:text-sky-400"
              href="/account"
            >
              {user?.split(" ")[0]}
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            className="bg-sky-600 text-white transition-all duration-200 hover:bg-sky-700"
          >
            <Link aria-label="Link to Login page" href="/login">
              Log in
            </Link>
          </Button>
        )}
      </div>
      <MobileMenu
        handleLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        user={user}
      />
    </>
  );
};

export default AuthButtons;
