import { notFound } from "next/navigation";
import Link from "next/link";
import { collections } from "@/lib/catalogTypes";
import { catalog } from "@/lib/catalog";
import TitleGrid from "@/components/TitleGrid";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  if (!c) notFound();
  const { result, p } = await catalog("movie", {
    genre: String(c.genre),
    sort: "vote_average.desc",
    page: (await searchParams).page,
  });
  return (
    <div className="shell">
      <div className="page-top">
        <p className="eyebrow">The CineScope collections</p>
        <h1>{c.title}</h1>
        <p>{c.subtitle} A genre-led selection, ordered by audience rating.</p>
      </div>
      <TitleGrid items={result.results} />
      <nav className="pagination" aria-label="Collection pages">
        {p.page > 1 && (
          <Link className="button subtle" href={`?page=${p.page - 1}`}>
            Previous
          </Link>
        )}
        {p.page < Math.min(result.total_pages, 500) && (
          <Link className="button subtle" href={`?page=${p.page + 1}`}>
            More discoveries
          </Link>
        )}
      </nav>
    </div>
  );
}
