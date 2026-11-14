"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { collection, limit, onSnapshot, query } from "firebase/firestore";
import { useAuth } from "./AuthProvider";
import type { MediaItem } from "@/lib/catalogTypes";
export type LibraryEntry = {
  id: number;
  kind: "movie" | "tv";
  title: string;
  poster_path: string;
  year: string;
  status: "watchlist" | "watched";
  rating: number;
};
type State = {
  owner: string;
  favorites: MediaItem[];
  entries: LibraryEntry[];
  loading: boolean;
  error: string;
};
const initial: State = {
  owner: "",
  favorites: [],
  entries: [],
  loading: true,
  error: "",
};
const Context = createContext<State>(initial);
export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { user, services, loading } = useAuth();
  const [state, setState] = useState<State>(initial);
  useEffect(() => {
    if (!user || !services) return;
    let active = true;
    let failed = false;
    const loaded = new Set<string>();
    const uid = user.uid;
    const movies: MediaItem[] = [];
    const shows: MediaItem[] = [];
    let entries: LibraryEntry[] = [];
    const publish = () => {
      if (active && !failed)
        setState({
          owner: uid,
          favorites: [...movies, ...shows],
          entries,
          loading: loaded.size < 3,
          error: "",
        });
    };
    const unsub = ["likedMovies", "likedShows", "library"].map((name) =>
      onSnapshot(
        query(collection(services.db, "users", uid, name), limit(200)),
        (snapshot) => {
          if (name === "library")
            entries = snapshot.docs.map((d) => d.data() as LibraryEntry);
          else {
            const target = name === "likedMovies" ? movies : shows;
            target.splice(
              0,
              target.length,
              ...snapshot.docs.map(
                (d) =>
                  ({
                    ...d.data(),
                    media_type: name === "likedMovies" ? "movie" : "tv",
                  }) as MediaItem,
              ),
            );
          }
          loaded.add(name);
          publish();
        },
        () => {
          failed = true;
          if (active)
            setState({
              ...initial,
              owner: uid,
              loading: false,
              error: "Could not load your library. Reload to retry.",
            });
        },
      ),
    );
    return () => {
      active = false;
      unsub.forEach((fn) => fn());
    };
  }, [user, services]);
  const value =
    state.owner === (user?.uid ?? "")
      ? state
      : { ...initial, loading: loading || !!user };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useLibrary = () => useContext(Context);
