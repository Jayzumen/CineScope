import Link from "next/link";
import AuthButtons from "./AuthButtons";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-900/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            aria-label="Home Page Link"
            className="font-vibes bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent transition-all duration-300 hover:scale-105"
            href="/"
          >
            CineScope
          </Link>
        </div>

        <AuthButtons />
      </div>
    </nav>
  );
};

export default Navbar;
