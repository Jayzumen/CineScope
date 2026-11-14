import test from "node:test";
import assert from "node:assert/strict";
import {
  pickRegion,
  regionFromAcceptLanguage,
  regionName,
} from "../src/lib/region.ts";
test("region preference: explicit choice, then cookie, geo, language, US", () => {
  const all = {
    query: "fr",
    cookie: "GB",
    geo: "DE",
    acceptLanguage: "ja-JP",
  };
  assert.equal(pickRegion(all), "FR");
  assert.equal(pickRegion({ ...all, query: undefined }), "GB");
  assert.equal(
    pickRegion({ ...all, query: undefined, cookie: undefined }),
    "DE",
  );
  assert.equal(pickRegion({ acceptLanguage: "ja-JP" }), "JP");
  assert.equal(pickRegion({}), "US");
  for (const bad of ["USA", "1A", "../", ["DE"], "<x>"])
    assert.equal(pickRegion({ query: bad, cookie: bad, geo: bad }), "US");
});
test("accept-language uses the most preferred tag that names a region", () => {
  assert.equal(regionFromAcceptLanguage("de-DE,de;q=0.9,en;q=0.8"), "DE");
  assert.equal(regionFromAcceptLanguage("de,en-GB;q=0.8"), "GB");
  assert.equal(regionFromAcceptLanguage("en-US;q=0.5,pt-BR"), "BR");
  assert.equal(regionFromAcceptLanguage("zh-Hant-TW"), undefined);
  assert.equal(regionFromAcceptLanguage("en;q=0,fr-CA;q=0"), undefined);
  assert.equal(regionFromAcceptLanguage(undefined), undefined);
  assert.equal(regionFromAcceptLanguage("x".repeat(600)), undefined);
  assert.equal(regionName("DE"), "Germany");
});
