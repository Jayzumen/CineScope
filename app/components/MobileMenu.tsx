"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const MobileMenu = ({
  handleLogout,
  isAuthenticated,
  user,
}: {
  handleLogout: () => void;
  isAuthenticated: boolean;
  user: string | null;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
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
  );
};

export default MobileMenu;
