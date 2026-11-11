import test from "node:test";
import assert from "node:assert/strict";
import {
  artworkUrl,
  artworkPlaceholder,
  selectTrailer,
} from "../src/lib/media.ts";
test("artwork uses bounded sizes and real fallbacks", () => {
  assert.equal(
    artworkUrl("/poster.jpg"),
    "https://image.tmdb.org/t/p/w500/poster.jpg",
  );
  assert.equal(
    artworkUrl(null, "w1280", "/poster.jpg"),
    "https://image.tmdb.org/t/p/w1280/poster.jpg",
  );
  for (const path of [
    null,
    undefined,
    "",
    "null",
    "/null",
    "//evil.test/a.jpg",
    "/a.svg",
    "/a.jpg?x=y",
    "/../a.jpg",
  ])
    assert.equal(artworkUrl(path), artworkPlaceholder);
});
test("trailer selection restricts providers and IDs, preferring official trailers", () => {
  const trailer = {
    key: "abcdefghijk",
    site: "YouTube",
    type: "Trailer",
    official: false,
  };
  const official = { ...trailer, key: "12345678901", official: true };
  assert.equal(selectTrailer([trailer, official]), official);
  assert.equal(selectTrailer([trailer]), trailer);
  assert.equal(
    selectTrailer([
      { ...trailer, site: "Vimeo" },
      { ...trailer, key: "bad?url" },
      { ...trailer, type: "Clip" },
    ]),
    undefined,
  );
  assert.equal(selectTrailer(undefined), undefined);
});
