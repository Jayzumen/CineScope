import test from "node:test";
import assert from "node:assert/strict";
import { pageCount, pageWindow } from "../src/lib/pagination.ts";

test("page count is clamped to what TMDB serves", () => {
  assert.equal(pageCount(0), 1);
  assert.equal(pageCount(7), 7);
  assert.equal(pageCount(40000), 500);
  assert.equal(pageCount(NaN), 1);
});

test("page window keeps first, last and neighbours, with real gaps only", () => {
  assert.deepEqual(pageWindow(1, 1), [1]);
  assert.deepEqual(pageWindow(1, 3), [1, 2, 3]);
  assert.deepEqual(pageWindow(1, 500), [1, 2, 3, "gap", 500]);
  assert.deepEqual(pageWindow(6, 500), [1, "gap", 4, 5, 6, 7, 8, "gap", 500]);
  // A gap never hides exactly one page.
  assert.deepEqual(pageWindow(4, 10), [1, 2, 3, 4, 5, 6, "gap", 10]);
  assert.deepEqual(pageWindow(7, 10), [1, "gap", 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(pageWindow(500, 900), [1, "gap", 498, 499, 500]);
  // Out-of-range current pages are clamped.
  assert.deepEqual(pageWindow(99, 5), [1, 2, 3, 4, 5]);
});
