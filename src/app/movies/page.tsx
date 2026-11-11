import CatalogPage from "@/components/CatalogPage";
export const metadata = {
  title: "Movies",
  description: "Discover films by genre, release year and rating.",
  alternates: { canonical: "/movies" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CatalogPage kind="movie" values={await searchParams} />;
}
