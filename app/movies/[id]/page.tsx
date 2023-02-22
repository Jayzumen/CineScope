import { baseUrl } from "@/app/constants";
import { getCredits, getMovie, getSimilar } from "@/app/getData";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "../types";

export async function generateStaticParams() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results.map((movie: Movie) => ({
    id: movie.id.toString(),
  }));
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);
  const credits = await getCredits(params.id);
  const cast = credits.cast.slice(0, 10);

  const similar = await getSimilar(params.id);
  return (
    <main className="flex flex-col justify-center ">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 h-[180vh] w-full sm:h-[100vh]">
        <Image
          className="object-cover opacity-40"
          fill={true}
          src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
          priority
          alt={movie?.title || movie?.original_title}
        />
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-semibold">{movie.title}</h1>
        <h2 className="mt-2 text-2xl italic">{movie.tagline}</h2>
      </div>
      {/* Movie Detail */}
      <div className="flex flex-col gap-4 px-10 lg:flex-row lg:justify-between">
        {/* Left */}
        <section>
          {/* Details */}
          <p className="text-3xl font-semibold">Release Date:</p>
          <p>{movie.release_date}</p>

          <p className="text-3xl font-semibold">Runtime:</p>
          <p>{movie.runtime} minutes</p>

          <p className="text-3xl font-semibold">Genres:</p>
          <div className="flex max-w-[500px] gap-2">
            {movie.genres.map((genre) => (
              <Link
                key={genre.id}
                className="transition hover:underline"
                href={`/genre/${genre.id}`}
              >
                {genre.name}
              </Link>
            ))}
          </div>

          <p className="text-3xl font-semibold">Plot:</p>
          <p className="max-w-[500px]">{movie.overview}</p>
        </section>

        {/* Right */}
        <section className="flex flex-col gap-4 lg:text-center">
          {/* Company */}
          <div>
            <p className="text-3xl font-semibold">Production Companies:</p>
            <div className="flex max-w-[500px] flex-wrap gap-2 lg:justify-center">
              {movie.production_companies.map((company) => (
                <p key={company.id}>{company.name}</p>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div>
            <p className="text-3xl font-semibold">Rating:</p>
            <p>{movie.vote_average}</p>
            <p className="text-3xl font-semibold">Vote Count:</p>
            <p>{movie.vote_count}</p>
          </div>

          {/* Money */}
          <div>
            <p className="text-3xl font-semibold">Budget:</p>
            <p>${Intl.NumberFormat().format(movie.budget)}</p>
            <p className="text-3xl font-semibold">Revenue:</p>
            <p>${Intl.NumberFormat().format(movie.revenue)}</p>
          </div>
        </section>
      </div>

      <div className="mt-60 px-10 py-4">
        {/* Cast */}
        <p className="my-2 text-3xl font-semibold">Cast:</p>
        <div className="flex flex-wrap gap-4">
          {cast.map((actor) => {
            if (actor.profile_path)
              return (
                <Link
                  key={actor.id}
                  href={`/actors/${actor.id}`}
                  className="flex flex-col items-center gap-2 rounded-md bg-slate-900 py-2 text-center shadow-md shadow-slate-500 transition hover:bg-slate-800"
                >
                  <p className="min-h-[60px] max-w-[140px] text-xl font-semibold">
                    {actor.name}
                  </p>
                  <Image
                    src={`${baseUrl}${actor.profile_path}`}
                    width={150}
                    height={100}
                    alt={actor.name}
                  />
                  <p className="min-h-[60px] max-w-[140px] text-xl">
                    {actor.character}
                  </p>
                </Link>
              );
          })}
        </div>
        <div className="pt-10">
          {/* Similar Movies */}
          <p className="my-2 text-3xl font-semibold">Similar Movies:</p>
          <div className="flex flex-wrap gap-4">
            {similar.slice(0, 10).map((movie) => {
              if (movie.poster_path && movie.backdrop_path)
                return (
                  <Link
                    key={movie.id}
                    href={`/movies/${movie.id}`}
                    className="rounded-md"
                  >
                    <Image
                      src={`${baseUrl}${
                        movie.poster_path || movie.backdrop_path
                      }`}
                      width={150}
                      height={100}
                      alt={movie.title}
                      title={movie.title}
                    />
                  </Link>
                );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
