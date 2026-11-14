import test from "node:test";
import assert from "node:assert/strict";
import {
  addedMillis,
  libraryDocument,
  libraryKey,
  mergeLibraryEntry,
} from "../src/lib/library.ts";
import {
  catalogParams,
  mediaId,
  ValidationError,
  genres,
  tvGenres,
} from "../src/lib/catalogValidation.ts";
const watched = { status: "watched", rating: 8, favorite: false };
test("library documents match the Firestore rule shape", () => {
  const doc = libraryDocument(
    {
      id: 42,
      title: "Up",
      poster_path: "/up.jpg",
      release_date: "2009-05-29",
    },
    "movie",
    watched,
  );
  assert.deepEqual(doc, {
    id: 42,
    kind: "movie",
    title: "Up",
    poster_path: "/up.jpg",
    year: "2009",
    status: "watched",
    rating: 8,
    favorite: false,
  });
  assert.equal(libraryKey("tv", 7), "tv-7");
  assert.equal(
    libraryDocument({ id: 1, year: "1999" }, "tv", watched).year,
    "1999",
  );
});
test("library documents clean values the rules would reject", () => {
  const doc = libraryDocument(
    {
      id: 7,
      name: "  ",
      original_name: "",
      poster_path: "/bad path?.jpg",
      first_air_date: "TBA",
    },
    "tv",
    { status: "watchlist", rating: 11, favorite: false },
  );
  assert.equal(doc.title, "Untitled");
  assert.equal(doc.poster_path, "");
  assert.equal(doc.year, "");
  assert.equal(doc.rating, 0);
  assert.equal(
    libraryDocument({ id: 1, title: "x".repeat(600) }, "movie", watched).title
      .length,
    500,
  );
  for (const id of [0, -1, 1.5, 99999999999])
    assert.throws(() => libraryDocument({ id }, "movie", watched));
  assert.throws(() => libraryDocument({ id: 1 }, "person", watched));
  assert.throws(() =>
    libraryDocument({ id: 1 }, "movie", { ...watched, status: "liked" }),
  );
});
test("merging keeps stored ratings and deletes entries that hold nothing", () => {
  const item = { id: 5, title: "Heat" };
  const stored = { ...libraryDocument(item, "movie", watched) };
  // Re-adding to the watchlist must not wipe the rating (the old bug).
  assert.equal(
    mergeLibraryEntry(stored, item, "movie", { status: "watchlist" }).rating,
    8,
  );
  assert.equal(
    mergeLibraryEntry(undefined, item, "movie", { status: "watchlist" }).rating,
    0,
  );
  // Favorite-only entries survive leaving the watchlist; plain ones are deleted.
  const favorite = mergeLibraryEntry(stored, item, "movie", { favorite: true });
  assert.equal(favorite.status, "watched");
  assert.equal(
    mergeLibraryEntry(favorite, item, "movie", { status: "" }).favorite,
    true,
  );
  assert.equal(mergeLibraryEntry(stored, item, "movie", { status: "" }), null);
  assert.equal(
    mergeLibraryEntry({ ...favorite, status: "" }, item, "movie", {
      favorite: false,
    }),
    null,
  );
  // Legacy entries without a favorite flag default to false.
  const legacy = { ...stored };
  delete legacy.favorite;
  assert.equal(
    mergeLibraryEntry(legacy, item, "movie", { rating: 3 }).favorite,
    false,
  );
  assert.equal(addedMillis({}), 0);
  assert.equal(addedMillis({ addedAt: { toMillis: () => 9 } }), 9);
});
test("validation failures are typed and genre filters share one source", () => {
  assert.throws(() => mediaId("0"), ValidationError);
  assert.throws(() => catalogParams({ genre: "27" }, "tv"), ValidationError);
  for (const g of genres)
    assert.equal(catalogParams({ genre: String(g.id) }, "movie").genre, g.id);
  for (const g of tvGenres)
    assert.equal(catalogParams({ genre: String(g.id) }, "tv").genre, g.id);
});
