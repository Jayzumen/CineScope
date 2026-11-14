import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  runTransaction,
  serverTimestamp,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import {
  libraryKey,
  mergeLibraryEntry,
  type LibraryChange,
  type LibraryEntry,
  type LibrarySource,
} from "./library";
/**
 * Applies a change inside a transaction, so values that are not part of the
 * change (rating, favorite, addedAt) are kept even when this title was not in
 * the loaded part of the library.
 */
export async function updateLibrary(
  db: Firestore,
  uid: string,
  item: LibrarySource,
  kind: "movie" | "tv",
  change: LibraryChange,
) {
  const ref = doc(db, "users", uid, "library", libraryKey(kind, item.id));
  await runTransaction(db, async (tx) => {
    const current = await tx.get(ref);
    const previous = current.exists()
      ? (current.data() as Partial<LibraryEntry>)
      : undefined;
    const next = mergeLibraryEntry(previous, item, kind, change);
    if (!next) {
      if (current.exists()) tx.delete(ref);
      return;
    }
    tx.set(ref, {
      ...next,
      // Older documents have no addedAt; the rules accept "now" for those.
      addedAt: previous?.addedAt ?? serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}
const legacyCollections = [
  ["likedMovies", "movie"],
  ["likedShows", "tv"],
] as const;
/**
 * Moves hearts from the old likedMovies/likedShows collections into the
 * library as favorites. Each title is written before its old document is
 * deleted, so an interrupted run loses nothing and simply continues next time.
 */
export async function migrateLegacyFavorites(db: Firestore, uid: string) {
  let moved = 0;
  for (const [name, kind] of legacyCollections) {
    for (let round = 0; round < 10; round++) {
      const snapshot = await getDocs(
        query(collection(db, "users", uid, name), limit(100)),
      );
      if (snapshot.empty) break;
      for (const legacy of snapshot.docs) {
        const data = legacy.data() as LibrarySource;
        const id = Number(legacy.id);
        if (Number.isSafeInteger(id) && id > 0)
          await updateLibrary(db, uid, { ...data, id }, kind, {
            favorite: true,
          });
        await deleteDoc(legacy.ref);
        moved++;
      }
    }
  }
  return moved;
}
/** Deletes every library document (and any unmigrated legacy favorites). */
export async function deleteAllLibraryData(db: Firestore, uid: string) {
  for (const name of ["library", "likedMovies", "likedShows"]) {
    for (;;) {
      const snapshot = await getDocs(
        query(collection(db, "users", uid, name), limit(400)),
      );
      if (snapshot.empty) break;
      const batch = writeBatch(db);
      snapshot.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }
}
