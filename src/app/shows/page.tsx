import { Metadata } from "next";
import ShowSearchForm from "./SearchForm";
import getShows from "@/lib/getTrendingShows";

export const metadata: Metadata = {
  title: "CineScope | TV Shows",
  description:
    "Discover trending TV shows and binge-worthy series on CineScope",
};

export default async function ShowsPage() {
  const shows = await getShows();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-sky-600/20"></div>
        <div className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
          <div className="animate-fade-in">
            <h1 className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-7xl">
              TV Shows
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
              Discover trending series, binge-worthy shows, and the latest in
              television entertainment.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <ShowSearchForm shows={shows} />
        </div>
      </section>
    </main>
  );
}
