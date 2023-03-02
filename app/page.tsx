import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import { baseUrl } from "./constants";
import { Movies } from "./movies/movieTypes";

async function getMovies() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results as Movies[];
}

export default async function Home() {
  const movies: Movies[] = await getMovies();
  return (
    <>
      <main className="flex min-h-[96vh] flex-col text-center">
        <h1 className="pt-6 text-4xl font-bold md:text-7xl">
          Welcome to <span className="text-sky-700">CineScope</span>
        </h1>
        <p className="mt-10 text-center text-2xl font-semibold">
          Latest Trending Movies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 p-10">
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
                height={400}
                src={baseUrl + movie.poster_path || movie.backdrop_path}
                alt={movie.title || movie.original_title}
                title={movie.title || movie.original_title}
              />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
