"use client";
import Link from "next/link";
import { useHydrated } from "@/hooks/use-hydrated";
import { usePathname } from "next/navigation";
import { Film, Search, Library, Menu, X, LogOut } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useAuth } from "./AuthProvider";
const links = [
  ["/", "Discover"],
  ["/movies", "Movies"],
  ["/shows", "TV shows"],
];
export default function Navbar() {
  const hydrated = useHydrated();
  const path = usePathname();
  const { user, services } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="shell nav-inner">
        <Link className="wordmark" href="/" aria-label="CineScope home">
          <Film size={22} />
          <span>
            Cine<span className="text-accent">Scope</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([url, label]) => (
            <Link
              key={url}
              href={url}
              aria-current={path === url ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <Link
            className="icon-button"
            href="/search"
            aria-label="Search movies, TV shows and people"
          >
            <Search size={20} />
          </Link>
          <Link className="button subtle library-link" href="/account">
            <Library size={17} />
            My library
          </Link>
          {user && services ? (
            <button
              className="icon-button"
              aria-label="Sign out"
              onClick={async () => {
                try {
                  await signOut(services.auth);
                  toast.success("Signed out");
                } catch {
                  toast.error("Could not sign out. Try again.");
                }
              }}
            >
              <LogOut size={18} />
            </button>
          ) : (
            <Link className="button small desktop-login" href="/login">
              Sign in
            </Link>
          )}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger
              disabled={!hydrated}
              className="icon-button mobile-menu"
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="mobile-panel">
                <Dialog.Title className="section-title">
                  Explore CineScope
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Main navigation
                </Dialog.Description>
                <Dialog.Close
                  className="icon-button panel-close"
                  aria-label="Close navigation"
                >
                  <X />
                </Dialog.Close>
                <nav aria-label="Mobile navigation">
                  {[
                    ...links,
                    ["/search", "Search"],
                    ["/account", "My library"],
                    ...(!user ? [["/login", "Sign in"]] : []),
                  ].map(([url, label]) => (
                    <Link
                      key={url}
                      href={url}
                      onClick={() => setOpen(false)}
                      aria-current={path === url ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
