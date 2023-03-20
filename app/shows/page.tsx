import getShows from "@/lib/getTrendingShows";
import { Metadata } from "next";
import SearchForm from "./SearchForm";

export const metadata: Metadata = {
  title: "CineScope | TV Shows",
  description: "The shows page for CineScope",
};

export default async function ShowsPage() {
  const shows = await getShows();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="mb-8 text-center text-5xl font-semibold">TV Shows</h1>
      <SearchForm shows={shows} />
    </main>
  );
}
