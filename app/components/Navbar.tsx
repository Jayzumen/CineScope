"use client";

import { auth } from "../../utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-10 w-full bg-black/40 text-xl">
      <div className="flex items-center justify-between py-4 px-10">
        <div className="flex items-center">
          <Link
            aria-label="Home Page Link"
            className=" font-vibes text-2xl font-bold text-sky-600 transition hover:font-bold hover:text-sky-500"
            href="/"
          >
            CineScope
          </Link>
        </div>
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

        {/* Mobile Menu */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            className="absolute top-4 right-4 z-10 flex text-2xl text-sky-600 transition hover:text-sky-500 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <AiOutlineClose size={30} /> : <FaBars size={30} />}
          </button>

          {isOpen && (
            <div className="absolute top-12 right-4 w-[50%] rounded-lg border border-slate-700 bg-black shadow-md shadow-slate-700">
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <Link
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Movies Page Link"
                  className="transition hover:underline"
                  href="/movies"
                >
                  Movies
                </Link>
                <Link
                  onClick={() => setIsOpen(!isOpen)}
                  aria-label="Shows Page Link"
                  className="transition hover:underline"
                  href="/shows"
                >
                  TV Shows
                </Link>

                {isAuthenticated ? (
                  <div className="flex flex-col items-center gap-4">
                    <Link
                      onClick={() => setIsOpen(!isOpen)}
                      className="transition hover:underline"
                      href="/account"
                    >
                      {user?.split(" ")[0]}
                    </Link>
                    <button
                      className="transition hover:underline"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(!isOpen);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Link to Login page"
                    className="transition hover:underline"
                    href="/login"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
