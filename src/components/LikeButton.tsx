"use client";
import { Heart } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLibrary, useLibraryEntry } from "./LibraryProvider";
import type { LibrarySource } from "@/lib/library";
import { updateLibrary } from "@/lib/libraryStore";
export default function LikeButton({
  item,
  kind,
  itemName,
  lookup = false,
}: {
  item: LibrarySource;
  kind: "movie" | "tv";
  itemName: string;
  /** Watch this title's document directly if the library is too large. */
  lookup?: boolean;
}) {
  const { user, services, loading } = useAuth();
  const library = useLibrary();
  const { entry, ready } = useLibraryEntry(kind, item.id, { lookup });
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const router = useRouter();
  const path = usePathname();
  const liked = entry?.favorite === true;
  async function toggle() {
    if (busy.current) return;
    if (!user || !services) {
      router.push(`/login?next=${encodeURIComponent(path)}`);
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      await updateLibrary(services.db, user.uid, item, kind, {
        favorite: !liked,
      });
      toast.success(liked ? "Removed from favorites" : "Added to favorites");
    } catch {
      toast.error("Could not update favorites. Please try again.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <button
      className={`icon-button ${liked ? "bookmark-active" : ""}`}
      type="button"
      onClick={toggle}
      disabled={loading || pending || (!!user && (!ready || !!library.error))}
      aria-pressed={liked}
      aria-label={`${liked ? "Remove" : "Save"} ${itemName} ${liked ? "from" : "to"} favorites`}
      title={library.error || `${liked ? "Remove from" : "Save to"} favorites`}
    >
      <Heart size={18} aria-hidden fill={liked ? "currentColor" : "none"} />
    </button>
  );
}
