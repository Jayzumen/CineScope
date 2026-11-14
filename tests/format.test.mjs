import test from "node:test";
import assert from "node:assert/strict";
import {
  ageInYears,
  formatDate,
  formatRuntime,
  languageName,
  plural,
} from "../src/lib/format.ts";
import { jsonLd, titleStructuredData } from "../src/lib/structuredData.ts";

test("runtime and counts read naturally", () => {
  assert.equal(formatRuntime(142), "2h 22m");
  assert.equal(formatRuntime(120), "2h");
  assert.equal(formatRuntime(45), "45m");
  for (const bad of [0, -5, undefined, null, NaN])
    assert.equal(formatRuntime(bad), "");
  assert.equal(plural(1, "season"), "1 season");
  assert.equal(plural(5, "season"), "5 seasons");
  assert.equal(plural(12345, "vote"), "12,345 votes");
});

test("languages and dates tolerate malformed upstream values", () => {
  assert.equal(languageName("en"), "English");
  assert.equal(languageName("ja"), "Japanese");
  assert.equal(languageName("xx"), "XX");
  assert.equal(languageName(""), "");
  assert.equal(languageName("not a code"), "");
  assert.equal(formatDate("1963-03-27"), "27 March 1963");
  for (const bad of ["", null, "2023-02-31", "1963", "27/03/1963"])
    assert.equal(formatDate(bad), "");
});

test("ages count only completed years", () => {
  const today = new Date(Date.UTC(2026, 10, 14));
  assert.equal(ageInYears("1963-03-27", null, today), 63);
  assert.equal(ageInYears("1963-11-15", null, today), 62);
  assert.equal(ageInYears("1963-11-14", null, today), 63);
  assert.equal(ageInYears("1930-05-31", "2020-05-30"), 89);
  assert.equal(ageInYears(null, null, today), null);
  assert.equal(ageInYears("2030-01-01", null, today), null);
});

test("structured data includes public facts only and cannot break out of its script", () => {
  const data = titleStructuredData(
    {
      id: 1,
      title: "Heat</script><script>alert(1)</script>",
      overview: "",
      poster_path: "/p.jpg",
      release_date: "1995-12-15",
      runtime: 170,
      vote_average: 7.94,
      vote_count: 100,
      genres: [{ name: "Crime" }],
      credits: {
        cast: [{ name: "Al Pacino" }],
        crew: [
          { name: "Michael Mann", job: "Director" },
          { name: "Someone", job: "Editor" },
        ],
      },
    },
    "movie",
    {
      name: "Heat</script><script>alert(1)</script>",
      url: "https://example.test/movies/1",
      image: "https://image.tmdb.org/t/p/w500/p.jpg",
    },
  );
  assert.equal(data["@type"], "Movie");
  assert.equal(data.duration, "PT170M");
  assert.deepEqual(data.director, [
    { "@type": "Person", name: "Michael Mann" },
  ]);
  assert.equal(data.aggregateRating.ratingValue, 7.9);
  assert.equal("description" in data, false);
  const serialized = jsonLd(data);
  assert.equal(serialized.includes("</script>"), false);
  assert.equal(JSON.parse(serialized).name, data.name);

  const show = titleStructuredData(
    { id: 2, name: "Show", poster_path: null, number_of_seasons: 3 },
    "tv",
    { name: "Show", url: "https://example.test/shows/2" },
  );
  assert.equal(show["@type"], "TVSeries");
  assert.equal(show.numberOfSeasons, 3);
  assert.equal("image" in show, false);
  assert.equal("aggregateRating" in show, false);
});
