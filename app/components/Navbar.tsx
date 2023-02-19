"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
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
      } sticky top-0 z-20 flex items-center justify-between py-4 px-4 text-xl md:px-10 `}
    >
      <p className="text-2xl font-semibold text-sky-700">CineScope</p>

      <ul className="flex gap-4">
        {Links.map((link) => {
          if (pathname !== link.href)
            return (
              <li key={link.href} className="transition hover:underline">
                <Link href={link.href}>{link.label}</Link>
              </li>
            );
        })}
      </ul>
    </nav>
  );
}

export default Navbar;
