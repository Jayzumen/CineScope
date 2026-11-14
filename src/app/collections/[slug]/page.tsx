import { notFound, redirect } from "next/navigation";
import { collections } from "@/lib/catalogTypes";
import { catalog } from "@/lib/catalog";
import { ValidationError } from "@/lib/catalogValidation";
import { pageCount } from "@/lib/pagination";
import TitleGrid from "@/components/TitleGrid";
import Pagination from "@/components/Pagination";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};
const find = (slug: string) => collections.find((x) => x.slug === slug);
export async function generateMetadata({ params }: Props) {
  const c = find((await params).slug);
  if (!c) notFound();
  return {
    title: c.title,
    description: `${c.subtitle} A genre-led selection, ordered by audience rating.`,
    alternates: { canonical: `/collections/${c.slug}` },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const c = find(slug);
  if (!c) notFound();
  const base = `/collections/${c.slug}`;
  let data;
  try {
    data = await catalog("movie", {
      genre: String(c.genre),
      sort: "vote_average.desc",
      page: (await searchParams).page,
    });
  } catch (error) {
    // A malformed or out-of-range page is a bad link, not an outage.
    if (error instanceof ValidationError) redirect(base);
    throw error;
  }
  const { result, p } = data;
  return (
    <div className="shell">
      <div className="page-top">
        <p className="eyebrow">The CineScope collections</p>
        <h1>{c.title}</h1>
        <p>{c.subtitle} A genre-led selection, ordered by audience rating.</p>
      </div>
      <div className="result-bar">
        <span>{result.total_results.toLocaleString("en-US")} titles</span>
        <span>
          Page {p.page} of {pageCount(result.total_pages)}
        </span>
      </div>
      <TitleGrid items={result.results} eagerFirst />
      <Pagination
        page={p.page}
        totalPages={result.total_pages}
        href={(n) => (n === 1 ? base : `${base}?page=${n}`)}
        label="Collection pages"
      />
    </div>
  );
}
