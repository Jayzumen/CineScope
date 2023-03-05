import getMovies from "@/lib/getTrendingMovies";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { baseUrl } from "../constants";

export const metadata: Metadata = {
  title: "CineScope | Movies",
  description: "The movies page for CineScope",
};

export default async function MoviesPage() {
  const movies: Movies[] = await getMovies();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="mb-8 text-center text-5xl font-semibold">Movies</h1>
      <div className="flex flex-wrap justify-center gap-y-12 gap-x-8">
        {movies.map((movie) => (
          <Link
            className="transition hover:opacity-80"
            aria-label={movie.title || movie.original_title}
            key={movie.id}
            href={`/movies/${movie.id}`}
          >
            <Image
              className="rounded-lg object-cover"
              width={300}
              height={400}
              src={baseUrl + movie.poster_path || movie.backdrop_path}
              alt={movie.title || movie.original_title}
              title={movie.title || movie.original_title}
            />
            <div className="flex flex-col items-center justify-center text-center">
              <p className="mx-auto mt-2 min-h-[40px] max-w-[250px] text-xl font-semibold">
                {movie.title || movie.original_title}
              </p>
              <div className="flex gap-2 text-gray-500">
                <p className="text-sm">⭐</p>
                <p className="text-sm">
                  {Math.round(movie.vote_average * 10) / 10}
                </p>
                <p className="text-sm">|</p>
                <p className="text-sm">{movie.release_date}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
