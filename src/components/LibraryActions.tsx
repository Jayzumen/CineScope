"use client";
import { Bookmark, Check } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useLibrary, useLibraryEntry } from "./LibraryProvider";
import { titleOf, type MediaItem } from "@/lib/catalogTypes";
import type { LibraryChange } from "@/lib/library";
import { updateLibrary } from "@/lib/libraryStore";
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
  const { entry, ready } = useLibraryEntry(kind, item.id, { lookup: true });
  const status = entry?.status || "";
  const router = useRouter();
  const path = usePathname();
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  async function save(change: LibraryChange, done: string) {
    if (busy.current) return;
    if (!user || !services) {
      router.push(`/login?next=${encodeURIComponent(path)}`);
      return;
    }
    busy.current = true;
    setPending(true);
    try {
      await updateLibrary(services.db, user.uid, item, kind, change);
      toast.success(done);
    } catch {
      toast.error("Could not update your library. Try again.");
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  const disabled =
    loading || pending || (!!user && (!ready || !!library.error));
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="button subtle"
        disabled={disabled}
        onClick={() =>
          status
            ? save({ status: "" }, "Removed from your lists")
            : save({ status: "watchlist" }, "Added to your watchlist")
        }
        aria-pressed={!!status}
      >
        {status ? <Check size={16} /> : <Bookmark size={16} />}{" "}
        {status ? "Saved" : "Watchlist"}
      </button>
      {!compact && (
        <>
          <button
            className="button subtle"
            disabled={disabled}
            aria-pressed={status === "watched"}
            onClick={() =>
              status === "watched"
                ? save({ status: "watchlist" }, "Moved back to your watchlist")
                : save({ status: "watched" }, "Marked as watched")
            }
          >
            <Check size={16} />
            {status === "watched" ? "Watched" : "Mark watched"}
          </button>
          <label className="field">
            <span className="sr-only">Your rating for {titleOf(item)}</span>
            <select
              aria-label={`Your rating for ${titleOf(item)}`}
              disabled={disabled}
              value={entry?.rating ?? 0}
              onChange={(e) =>
                save(
                  {
                    status: status || "watched",
                    rating: Number(e.target.value),
                  },
                  "Rating saved",
                )
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
