"use client";
import { Heart } from "lucide-react";
import { useRef, useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLibrary } from "./LibraryProvider";
import {
  favoriteDocument,
  type FavoriteCollection,
  type FavoriteSource,
} from "@/lib/favorites";
export default function LikeButton({
  item,
  collectionName,
  itemName,
}: {
  item: FavoriteSource;
  collectionName: FavoriteCollection;
  itemName: string;
}) {
  const { user, services, loading } = useAuth();
  const library = useLibrary();
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const router = useRouter();
  const path = usePathname();
  const kind = collectionName === "likedMovies" ? "movie" : "tv";
  const liked = library.favorites.some(
    (x) => x.id === item.id && x.media_type === kind,
  );
  async function toggle() {
    if (busy.current) return;
    if (!user || !services) {
      router.push(`/login?next=${encodeURIComponent(path)}`);
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      const ref = doc(
        services.db,
        "users",
        user.uid,
        collectionName,
        String(item.id),
      );
      if (liked) await deleteDoc(ref);
      else await setDoc(ref, favoriteDocument(item, collectionName));
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
      disabled={
        loading || pending || (!!user && (library.loading || !!library.error))
      }
      aria-pressed={liked}
      aria-label={`${liked ? "Remove" : "Save"} ${itemName} ${liked ? "from" : "to"} favorites`}
      title={library.error || `${liked ? "Remove from" : "Save to"} favorites`}
    >
      <Heart size={18} aria-hidden fill={liked ? "currentColor" : "none"} />
    </button>
  );
}
