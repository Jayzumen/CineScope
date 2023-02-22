import Image from "next/image";
import Link from "next/link";
import { Movie } from "./types";

async function getMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const movies = await res.json();
  const results = movies.results as Movie[];
  return results;
}

export default async function MoviesPage() {
  const movies = await getMovies();
  return (
    <main className="flex flex-col justify-center gap-4 py-8 text-center">
      <h1 className="my-4 text-5xl font-semibold underline">
        Top trending Movies
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        {movies.map((movie) => (
          <Link
            aria-label={`Link to ${movie.title || movie.original_title} page`}
            href={`/movies/${movie.id}`}
            key={movie.id}
            className="rounded-md border border-slate-500 shadow-md shadow-slate-500 transition hover:opacity-70"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${
                movie.poster_path || movie.backdrop_path
              }`}
              alt={movie.title}
              width={300}
              height={250}
              title={movie.title}
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
