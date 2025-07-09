"use client";

import { useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { ModeToggle } from "./ui/mode-toggle";
import { Button } from "./ui/button";

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
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/50 text-sky-400 backdrop-blur-sm transition-all duration-200 hover:bg-slate-700/50 hover:text-sky-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={20} /> : <FaBars size={20} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="animate-in slide-in-from-top-2 absolute top-16 right-4 w-64 rounded-xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-md duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-700 pb-4">
                <Link
                  onClick={() => setIsOpen(false)}
                  aria-label="Movies Page Link"
                  className="flex items-center py-2 font-medium text-slate-300 transition-colors duration-200 hover:text-sky-400"
                  href="/movies"
                >
                  Movies
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  aria-label="Shows Page Link"
                  className="flex items-center py-2 font-medium text-slate-300 transition-colors duration-200 hover:text-purple-400"
                  href="/shows"
                >
                  TV Shows
                </Link>
              </div>

              <div className="border-b border-slate-700 pb-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      onClick={() => setIsOpen(false)}
                      className="flex items-center py-2 font-medium text-slate-300 transition-colors duration-200 hover:text-sky-400"
                      href="/account"
                    >
                      {user?.split(" ")[0]}
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 transition-all duration-200 hover:border-slate-500 hover:bg-slate-800"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link
                    onClick={() => setIsOpen(false)}
                    aria-label="Link to Login page"
                    href="/login"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-sky-600 text-white transition-all duration-200 hover:bg-sky-700"
                    >
                      Log in
                    </Button>
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Theme</span>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
