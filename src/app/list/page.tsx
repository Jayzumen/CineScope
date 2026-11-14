import { notFound } from "next/navigation";
import { detail } from "@/lib/catalog";
import type { MediaItem } from "@/lib/catalogTypes";
import TitleGrid from "@/components/TitleGrid";
export const metadata = {
  title: "A shared collection",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    titles?: string | string[];
    name?: string | string[];
  }>;
}) {
  const p = await searchParams;
  const raw = typeof p.titles === "string" ? p.titles : "";
  const name =
    typeof p.name === "string" ? p.name.replace(/\s+/g, " ").trim() : "";
  if (
    raw.length > 250 ||
    !/^(movie|tv)-[1-9]\d{0,9}(,(movie|tv)-[1-9]\d{0,9}){0,11}$/.test(raw)
  )
    notFound();
  const keys = [...new Set(raw.split(","))];
  const results = await Promise.allSettled(
    keys.map(async (key) => {
      const [kind, id] = key.split("-");
      const item = await detail<MediaItem>(kind as "movie" | "tv", id);
      return { ...item, media_type: kind as "movie" | "tv" };
    }),
  );
  const items = results.flatMap((r) =>
    r.status === "fulfilled" ? [r.value] : [],
  );
  return (
    <div className="shell">
      <div className="page-top">
        <p className="eyebrow">Stories are better shared</p>
        <h1>{name.slice(0, 80) || "A collection for you"}</h1>
        <p>
          A handpicked list of films and series. Save the ones that speak to
          you.
        </p>
      </div>
      {items.length < keys.length && (
        <p role="status" className="alert">
          Some titles could not be loaded. Try again later.
        </p>
      )}
      <TitleGrid items={items} />
    </div>
  );
}
