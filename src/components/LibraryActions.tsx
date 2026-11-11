"use client";
import { Bookmark, Check } from "lucide-react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLibrary } from "./LibraryProvider";
import { titleOf, type MediaItem } from "@/lib/catalogTypes";
export default function LibraryActions({
  item,
  kind,
  compact = false,
}: {
  item: MediaItem;
  kind: "movie" | "tv";
  compact?: boolean;
}) {
  const { user, services, loading } = useAuth();
  const library = useLibrary();
  const entry = library.entries.find(
    (e) => e.id === item.id && e.kind === kind,
  );
  const router = useRouter();
  const path = usePathname();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  async function save(
    status: "watchlist" | "watched" | "remove",
    rating = entry?.rating ?? 0,
  ) {
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
        "library",
        `${kind}-${item.id}`,
      );
      if (status === "remove") await deleteDoc(ref);
      else
        await setDoc(ref, {
          id: item.id,
          kind,
          title: titleOf(item).slice(0, 500),
          poster_path: item.poster_path ?? "",
          year: (item.release_date || item.first_air_date || "").slice(0, 4),
          status,
          rating,
        });
      toast.success(
        status === "remove" ? "Removed from library" : "Library updated",
      );
    } catch {
      toast.error("Could not update your library. Try again.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  const disabled =
    loading || pending || (!!user && (library.loading || !!library.error));
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="button subtle"
        disabled={disabled}
        onClick={() => save(entry ? "remove" : "watchlist")}
        aria-pressed={!!entry}
      >
        {entry ? <Check size={16} /> : <Bookmark size={16} />}{" "}
        {entry ? "Saved" : "Watchlist"}
      </button>
      {!compact && (
        <>
          <button
            className="button subtle"
            disabled={disabled}
            aria-pressed={entry?.status === "watched"}
            onClick={() =>
              save(entry?.status === "watched" ? "watchlist" : "watched")
            }
          >
            <Check size={16} />
            {entry?.status === "watched" ? "Watched" : "Mark watched"}
          </button>
          <label className="field">
            <span className="sr-only">Your rating for {titleOf(item)}</span>
            <select
              aria-label={`Your rating for ${titleOf(item)}`}
              disabled={disabled}
              value={entry?.rating ?? 0}
              onChange={(e) =>
                save(entry?.status ?? "watched", Number(e.target.value))
              }
            >
              <option value="0">Your rating</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} / 10
                </option>
              ))}
            </select>
          </label>
        </>
      )}
    </div>
  );
}
