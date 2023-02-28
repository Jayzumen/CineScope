"use client";

import { auth } from "@/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>("");

  const handleLogout = async () => {
    signOut(auth)
      .then(() => {
        setIsAuthenticated(false);
        setUser("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUser = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user?.displayName);
      } else {
        setIsAuthenticated(false);
        setUser("");
      }
    });
  };

  useEffect(() => {
    getUser();
  }, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-10 bg-black text-xl">
      <div className="flex items-center justify-between py-4 px-10">
        <div className="flex items-center">
          <Link
            aria-label="Home Page Link"
            className="font-semibold italic text-sky-600 transition hover:underline"
            href="/"
          >
            CineScope
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            aria-label="Movies Page Link"
            className="transition hover:underline"
            href="/movies"
          >
            Movies
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
      </div>
    </nav>
  );
};

export default Navbar;
