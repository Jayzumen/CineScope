"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const Links = [
    { href: "/", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/shows", label: "TV Shows" },
  ];

  return (
    <nav
      className={`${
        isScrolled ? "bg-slate-900" : "bg-transparent"
      } sticky top-0 flex items-center justify-between py-4 px-4 text-xl md:px-10 `}
    >
      <p className="text-2xl font-semibold text-sky-500">CineScope</p>

      <ul className="hidden gap-4 md:flex">
        {Links.map((link) => {
          if (pathname !== link.href)
            return (
              <li key={link.href} className="transition hover:underline">
                <Link href={link.href}>{link.label}</Link>
              </li>
            );
        })}
      </ul>

      {/* Mobile NavList   */}
      <div className="flex flex-col md:hidden">
        <button
          aria-label="Open/Close Navbar Button"
          onClick={() => {
            setNav(!nav);
            setDropdownOpen(!dropdownOpen);
          }}
        >
          {nav ? (
            <AiOutlineClose className="absolute top-5 right-5 text-3xl" />
          ) : (
            <GiHamburgerMenu className="absolute top-5 right-5 text-3xl" />
          )}
        </button>

        {dropdownOpen && (
          <div
            className={`${
              nav ? "block" : "hidden"
            } absolute right-4 mt-10 rounded-md bg-zinc-800 p-2 text-2xl md:hidden`}
          >
            <ul className="flex flex-col gap-4">
              {Links.map((link) => (
                <li key={link.label} className="hover:underline">
                  <Link
                    onClick={() => {
                      setNav(!nav);
                      setDropdownOpen(!dropdownOpen);
                    }}
                    aria-label={`Link to ${link.label}`}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
