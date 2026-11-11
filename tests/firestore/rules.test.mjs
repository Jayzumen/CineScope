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
} from "firebase/firestore";
import { favoriteDocument } from "../../src/lib/favorites.ts";
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
for (const kind of ["likedMovies", "likedShows"]) {
  const data = favoriteDocument(
    { id: 123, title: "Up", name: "Dark", vote_average: 8.1 },
    kind,
  );
  test(`${kind}: owner can create, read, list, update, and delete`, async () => {
    const db = env.authenticatedContext("alice").firestore();
    const ref = doc(db, "users/alice", kind, "123");
    await assertSucceeds(setDoc(ref, data));
    await assertSucceeds(getDoc(ref));
    await assertSucceeds(getDocs(collection(db, "users/alice", kind)));
    await assertSucceeds(updateDoc(ref, { vote_average: 9 }));
    await assertSucceeds(deleteDoc(ref));
  });
  test(`${kind}: unauthenticated and other users cannot access favorites`, async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), "users/alice", kind, "123"), data),
    );
    for (const ctx of [
      env.unauthenticatedContext(),
      env.authenticatedContext("bob"),
    ]) {
      const db = ctx.firestore();
      const ref = doc(db, "users/alice", kind, "123");
      await assertFails(getDoc(ref));
      await assertFails(getDocs(collection(db, "users/alice", kind)));
      await assertFails(setDoc(ref, data));
      await assertFails(updateDoc(ref, { vote_average: 9 }));
      await assertFails(deleteDoc(ref));
    }
  });
  test(`${kind}: reject malformed, oversized, extra fields and mismatched IDs`, async () => {
    const ref = doc(
      env.authenticatedContext("alice").firestore(),
      "users/alice",
      kind,
      "123",
    );
    for (const patch of [
      { id: 124 },
      { id: "123" },
      { id: -1 },
      { admin: true },
      { overview: "x".repeat(5001) },
      { poster_path: "https://evil.test/image" },
      { vote_average: 11 },
      { vote_average: -1 },
      { vote_average: "8" },
      { [kind === "likedMovies" ? "title" : "name"]: "" },
      { [kind === "likedMovies" ? "release_date" : "first_air_date"]: "bad" },
    ]) {
      await assertFails(setDoc(ref, { ...data, ...patch }));
    }
    await assertFails(setDoc(ref, { id: 123 }));
  });
  test(`${kind}: legacy full documents remain readable and deletable`, async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), "users/alice", kind, "123"), {
        ...data,
        videos: { results: [] },
      }),
    );
    const ref = doc(
      env.authenticatedContext("alice").firestore(),
      "users/alice",
      kind,
      "123",
    );
    await assertSucceeds(getDoc(ref));
    await assertFails(updateDoc(ref, { vote_average: 9 }));
    await assertSucceeds(setDoc(ref, data));
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

test("library: private watch status and ratings enforce owner, shape, ranges, and identity", async () => {
  const data = {
    id: 123,
    kind: "movie",
    title: "Up",
    poster_path: "/test.jpg",
    year: "2009",
    status: "watchlist",
    rating: 0,
  };
  const db = env.authenticatedContext("alice").firestore();
  const ref = doc(db, "users/alice/library/movie-123");
  await assertSucceeds(setDoc(ref, data));
  await assertSucceeds(updateDoc(ref, { status: "watched", rating: 9 }));
  for (const ctx of [
    env.unauthenticatedContext(),
    env.authenticatedContext("bob"),
  ]) {
    const other = doc(ctx.firestore(), "users/alice/library/movie-123");
    await assertFails(getDoc(other));
    await assertFails(setDoc(other, data));
    await assertFails(deleteDoc(other));
  }
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
  ])
    await assertFails(setDoc(ref, { ...data, ...patch }));
  await assertSucceeds(deleteDoc(ref));
});
