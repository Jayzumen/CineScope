import { Metadata } from "next";
import Link from "next/link";
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
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Movies</h1>
      <div className="flex flex-col justify-center gap-2">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            {movie.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
