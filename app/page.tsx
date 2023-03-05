import getMoviesDay from "@/lib/getMoviesDay";
import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import { baseUrl } from "./constants";
import { truncateString } from "./constants";

export default async function Home() {
  const movies: Movies[] = await getMoviesDay();

  const randomMovies = movies.sort(() => Math.random() - 0.5).slice(0, 5);

  return (
    <>
      <main className="flex min-h-screen flex-col">
        <h1 className="pt-6 text-center text-4xl font-bold md:text-7xl">
          Welcome to <span className="text-sky-700">CineScope</span>
        </h1>
        <section className="px-5 lg:w-[40%]">
          <p className="mt-10 text-center text-2xl font-semibold ">
            Trending Movies
          </p>
          <div className="flex flex-col gap-4 p-4">
            {randomMovies.map((movie) => (
              <Link
                className="flex flex-col items-center gap-2 rounded-md bg-slate-700/50 transition hover:opacity-80 md:flex-row md:items-start"
                aria-label={movie.title || movie.original_title}
                key={movie.id}
                href={`/movies/${movie.id}`}
              >
                <Image
                  height={300}
                  width={200}
                  className="rounded-lg"
                  src={baseUrl + movie.poster_path}
                  alt={movie.title || movie.original_title}
                  title={movie.title || movie.original_title}
                />
                <div className="flex flex-col gap-2 p-4">
                  <p className="border-b text-center text-xl font-semibold">
                    {movie.title || movie.original_title}
                  </p>
                  <p className="text-md italic">{movie.release_date}</p>
                  <p>{truncateString(movie.overview, 200)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
