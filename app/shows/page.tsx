import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { baseUrl } from "../constants";

async function getShows() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results as Shows[];
}

export const metadata: Metadata = {
  title: "CineScope | TV Shows",
  description: "The shows page for CineScope",
};

export default async function ShowsPage() {
  const shows = await getShows();
  return (
    <main className="flex flex-col justify-center p-10">
      <h1 className="mb-8 text-center text-5xl font-semibold">TV Shows</h1>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-8">
        {shows.map((show) => (
          <Link
            className="transition hover:opacity-80"
            aria-label={`Link to ${show.name}`}
            href={`/shows/${show.id}`}
            key={show.id}
          >
            <Image
              className="rounded-lg object-cover"
              width={200}
              height={300}
              src={baseUrl + show.poster_path || show.backdrop_path}
              alt={show.name || show.original_name}
              title={show.name || show.original_name}
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
