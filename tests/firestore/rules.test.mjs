import { before, after, beforeEach, test } from "node:test";
import { readFile } from "node:fs/promises";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
let env;
before(async () => {
  if (process.env.FIRESTORE_EMULATOR_HOST !== "127.0.0.1:8085")
    throw new Error("Local emulator required");
  env = await initializeTestEnvironment({
    projectId: "demo-cinescope",
    firestore: {
      host: "127.0.0.1",
      port: 8085,
      rules: await readFile("firestore.rules", "utf8"),
    },
  });
});
beforeEach(async () => env.clearFirestore());
after(async () => env?.cleanup());
const fields = {
  id: 123,
  kind: "movie",
  title: "Up",
  poster_path: "/test.jpg",
  year: "2009",
  status: "watchlist",
  rating: 0,
  favorite: false,
};
const fresh = (patch = {}) => ({
  ...fields,
  addedAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  ...patch,
});
const seed = (path, data) =>
  env.withSecurityRulesDisabled((ctx) =>
    setDoc(doc(ctx.firestore(), path), data),
  );
for (const kind of ["likedMovies", "likedShows"]) {
  const legacy = {
    id: 123,
    title: "Up",
    name: "Dark",
    poster_path: "",
    overview: "",
    vote_average: 8,
  };
  test(`${kind}: legacy favorites are owner read/delete only, for migration`, async () => {
    await seed(`users/alice/${kind}/123`, legacy);
    const db = env.authenticatedContext("alice").firestore();
    const ref = doc(db, "users/alice", kind, "123");
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(getDocs(collection(db, "users/alice", kind)));
    await assertFails(setDoc(doc(db, "users/alice", kind, "124"), legacy));
    await assertFails(updateDoc(ref, { vote_average: 9 }));
    for (const ctx of [
      env.unauthenticatedContext(),
      env.authenticatedContext("bob"),
    ]) {
      const other = doc(ctx.firestore(), "users/alice", kind, "123");
      await assertFails(getDoc(other));
      await assertFails(deleteDoc(other));
    }
    await assertSucceeds(deleteDoc(ref));
  });
}
test("unrecognized paths are denied even for authenticated users", async () => {
  const db = env.authenticatedContext("alice").firestore();
  for (const path of [
    "users/alice",
    "users/alice/other/123",
    "admin/settings",
  ]) {
    await assertFails(setDoc(doc(db, path), { admin: true }));
    await assertFails(getDoc(doc(db, path)));
  }
});
test("library: owner-only access with server timestamps", async () => {
  const db = env.authenticatedContext("alice").firestore();
  const ref = doc(db, "users/alice/library/movie-123");
  await assertSucceeds(setDoc(ref, fresh()));
  const stored = (await getDoc(ref)).data();
  await assertSucceeds(
    setDoc(ref, {
      ...fields,
      status: "watched",
      rating: 9,
      favorite: true,
      addedAt: stored.addedAt,
      updatedAt: serverTimestamp(),
    }),
  );
  // addedAt is immutable and updatedAt must be the server time.
  await assertFails(
    updateDoc(ref, {
      addedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(updateDoc(ref, { rating: 3 }));
  await assertSucceeds(
    updateDoc(ref, { rating: 3, updatedAt: serverTimestamp() }),
  );
  for (const ctx of [
    env.unauthenticatedContext(),
    env.authenticatedContext("bob"),
  ]) {
    const other = doc(ctx.firestore(), "users/alice/library/movie-123");
    await assertFails(getDoc(other));
    await assertFails(setDoc(other, fresh()));
    await assertFails(deleteDoc(other));
  }
  await assertSucceeds(deleteDoc(ref));
});
test("library: favorites can exist without a list status, but empty entries cannot", async () => {
  const ref = doc(
    env.authenticatedContext("alice").firestore(),
    "users/alice/library/tv-7",
  );
  const tv = { id: 7, kind: "tv" };
  await assertSucceeds(
    setDoc(ref, fresh({ ...tv, status: "", favorite: true })),
  );
  await deleteDoc(ref);
  await assertFails(setDoc(ref, fresh({ ...tv, status: "", favorite: false })));
});
test("library: reject malformed, oversized, extra fields, bad timestamps and mismatched IDs", async () => {
  const ref = doc(
    env.authenticatedContext("alice").firestore(),
    "users/alice/library/movie-123",
  );
  for (const patch of [
    { rating: 11 },
    { rating: -1 },
    { rating: 1.5 },
    { status: "public" },
    { kind: "person" },
    { id: 124 },
    { title: "" },
    { admin: true },
    { year: "invalid" },
    { poster_path: "https://evil.test" },
    { favorite: "yes" },
    { addedAt: Timestamp.fromDate(new Date("2000-01-01")) },
    { updatedAt: Timestamp.fromDate(new Date("2099-01-01")) },
  ])
    await assertFails(setDoc(ref, fresh(patch)));
  await assertFails(setDoc(ref, fields));
});
test("library: entries from before timestamps can be upgraded on their next write", async () => {
  const oldShape = { ...fields };
  delete oldShape.favorite;
  await seed("users/alice/library/movie-123", oldShape);
  const ref = doc(
    env.authenticatedContext("alice").firestore(),
    "users/alice/library/movie-123",
  );
  await assertSucceeds(getDoc(ref));
  await assertFails(updateDoc(ref, { rating: 4 }));
  await assertSucceeds(setDoc(ref, fresh({ rating: 4 })));
});
