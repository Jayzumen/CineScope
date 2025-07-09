import Link from "next/link";
import AuthButtons from "./AuthButtons";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-10 w-full bg-black/40 text-xl">
      <div className="flex items-center justify-between px-10 py-4">
        <div className="flex items-center">
          <Link
            aria-label="Home Page Link"
            className="font-vibes text-2xl font-bold text-sky-600 transition hover:font-bold hover:text-sky-500"
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
