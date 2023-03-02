import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { baseUrl } from "../constants";
import { Movies } from "./movieTypes";

async function getMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results as Movies[];
}

export const metadata: Metadata = {
  title: "CineScope | Movies",
  description: "The movies page for CineScope",
};

export default async function MoviesPage() {
  const movies: Movies[] = await getMovies();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="mb-8 text-center text-5xl font-semibold">Movies</h1>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-center gap-8">
        {movies.map((movie) => (
          <Link
            className="transition hover:opacity-80"
            aria-label={movie.title || movie.original_title}
            key={movie.id}
            href={`/movies/${movie.id}`}
          >
            <Image
              className="rounded-lg object-cover"
              width={200}
              height={300}
              src={baseUrl + movie.poster_path || movie.backdrop_path}
              alt={movie.title || movie.original_title}
              title={movie.title || movie.original_title}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
