import Image from "next/image";
import Link from "next/link";
import { getTVShows } from "../getData";

export default async function ShowsPage() {
  const shows = await getTVShows();
  return (
    <main className="flex flex-col justify-center gap-4 py-8 text-center">
      <h1 className="text-5xl font-semibold underline">Top trending Shows</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {shows.map((show) => (
          <Link
            aria-label={`Link to ${show.name || show.original_name} page`}
            href={`/shows/${show.id}`}
            key={show.id}
            className="shadow-md shadow-slate-500 transition hover:opacity-70"
          >
            <div className="flex flex-col gap-2">
              <p className="mx-auto min-h-[50px] max-w-[250px] text-xl font-semibold">
                {show.name || show.original_name}
              </p>

              <Image
                src={`https://image.tmdb.org/t/p/w500${
                  show.poster_path || show.backdrop_path
                }`}
                alt={show.name}
                width={250}
                height={250}
              />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
