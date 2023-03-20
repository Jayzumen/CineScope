"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import MobileMenu from "./MobileMenu";

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
          setUser(user?.displayName);
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
      <div className="hidden items-center gap-4 md:flex">
        <Link
          aria-label="Movies Page Link"
          className="transition hover:underline"
          href="/movies"
        >
          Movies
        </Link>
        <Link
          aria-label="Shows Page Link"
          className="transition hover:underline"
          href="/shows"
        >
          TV Shows
        </Link>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link className="transition hover:underline" href="/account">
              {user?.split(" ")[0]}
            </Link>
            <button
              className="transition hover:underline"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            aria-label="Link to Login page"
            className="transition hover:underline"
            href="/login"
          >
            Log in
          </Link>
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
