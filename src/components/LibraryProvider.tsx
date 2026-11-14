"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { collection, doc, limit, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "./AuthProvider";
import { libraryKey, type LibraryEntry } from "@/lib/library";
import { migrateLegacyFavorites } from "@/lib/libraryStore";
export type { LibraryEntry };
// Listeners are bounded; beyond this, components look up single titles on demand.
export const LIBRARY_PAGE_SIZE = 500;
type State = {
  owner: string;
  entries: LibraryEntry[];
  /** True when the listener hit its limit and may be missing titles. */
  truncated: boolean;
  loading: boolean;
  error: string;
};
const initial: State = {
  owner: "",
  entries: [],
  truncated: false,
  loading: true,
  error: "",
};
const Context = createContext<State>(initial);
const migrated = new Set<string>();
export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { user, services, loading } = useAuth();
  const [state, setState] = useState<State>(initial);
  useEffect(() => {
    if (!user || !services) return;
    let active = true;
    const uid = user.uid;
    // One-time move of hearts from the old favorites collections. Failures
    // are retried on the next visit; the listener below shows the result.
    if (!migrated.has(uid)) {
      migrated.add(uid);
      migrateLegacyFavorites(services.db, uid).catch(() =>
        migrated.delete(uid),
      );
    }
    const unsubscribe = onSnapshot(
      query(
        collection(services.db, "users", uid, "library"),
        limit(LIBRARY_PAGE_SIZE),
      ),
      (snapshot) => {
        if (active)
          setState({
            owner: uid,
            entries: snapshot.docs.map((d) => d.data() as LibraryEntry),
            truncated: snapshot.size >= LIBRARY_PAGE_SIZE,
            loading: false,
            error: "",
          });
      },
      () => {
        if (active)
          setState({
            ...initial,
            owner: uid,
            loading: false,
            error: "Could not load your library. Reload to retry.",
          });
      },
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, services]);
  const value =
    state.owner === (user?.uid ?? "")
      ? state
      : { ...initial, loading: loading || !!user };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useLibrary = () => useContext(Context);
/**
 * The stored entry for one title. When the shared listener is full and the
 * title is not in it, `lookup` watches that single document instead, so a
 * saved title is never shown as unsaved. `ready` is false until known.
 */
export function useLibraryEntry(
  kind: "movie" | "tv",
  id: number,
  { lookup = false }: { lookup?: boolean } = {},
) {
  const { user, services } = useAuth();
  const library = useLibrary();
  const listed = library.entries.find((e) => e.id === id && e.kind === kind);
  const watch = lookup && !listed && library.truncated && !!user && !!services;
  const key = `${user?.uid}:${libraryKey(kind, id)}`;
  const [single, setSingle] = useState<{
    key: string;
    entry: LibraryEntry | null;
  } | null>(null);
  useEffect(() => {
    if (!watch || !user || !services) return;
    return onSnapshot(
      doc(services.db, "users", user.uid, "library", libraryKey(kind, id)),
      (snapshot) =>
        setSingle({
          key,
          entry: snapshot.exists() ? (snapshot.data() as LibraryEntry) : null,
        }),
      () => setSingle({ key, entry: null }),
    );
  }, [watch, user, services, kind, id, key]);
  const singleReady = !watch || single?.key === key;
  return {
    entry: listed ?? (watch && single?.key === key ? single.entry : undefined),
    ready: !library.loading && !library.error && singleReady,
  };
}
