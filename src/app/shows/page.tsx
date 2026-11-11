import CatalogPage from "@/components/CatalogPage";
export const metadata = {
  title: "TV shows",
  description: "Find your next series by genre, year and rating.",
  alternates: { canonical: "/shows" },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CatalogPage kind="tv" values={await searchParams} />;
}
