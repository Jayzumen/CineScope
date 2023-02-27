"use client";

import supabase from "@/utils/supabase";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | undefined>("");

  const getUser = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      console.log(error);
    }
    if (!session?.user) {
      setIsAuthenticated(false);
    } else if (session?.user?.app_metadata.provider === "google") {
      setIsAuthenticated(true);
      setUser(session.user.identities![0].identity_data.name);
    } else {
      setIsAuthenticated(true);
      setUser(session.user.identities![0].identity_data.user_name);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUser("");
    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [isAuthenticated]);

  return (
    <nav className="text-xl">
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
              <Link
                className="transition hover:underline"
                href={`/user/${user}`}
              >
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
