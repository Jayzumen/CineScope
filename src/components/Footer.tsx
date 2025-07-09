import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800/50 bg-slate-900/95">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block">
              <h3 className="font-vibes mb-4 bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
                CineScope
              </h3>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Discover the latest in cinema and television. Explore trending
              movies, binge-worthy shows, and the stars that bring them to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/movies"
                  className="text-sm text-slate-400 transition-colors duration-200 hover:text-sky-400"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/shows"
                  className="text-sm text-slate-400 transition-colors duration-200 hover:text-purple-400"
                >
                  TV Shows
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Connect</h4>
            <div className="flex space-x-4">
              <Link
                href="https://github.com/Jayzumen"
                className="text-slate-400 transition-colors duration-200 hover:text-sky-400"
                aria-label="GitHub"
                target="_blank"
              >
                <FaGithub size={20} />
              </Link>
              <Link
                href="mailto:jnreinhardt96@gmail.com"
                className="text-slate-400 transition-colors duration-200 hover:text-sky-400"
                aria-label="Email"
              >
                <Mail size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-slate-400 sm:text-left">
              © 2024 CineScope. All rights reserved.
            </p>
            <p className="text-center text-xs text-slate-500 sm:text-right">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
