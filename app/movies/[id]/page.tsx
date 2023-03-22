import { baseUrl } from "@/app/constants";
import getMovie from "@/lib/getMovie";
import getMovieCredits from "@/lib/getMovieCredits";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "./LikeButton";
import Trailer from "./Trailer";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const movie = await getMovie(params.id);
  return {
    title: `CineScope | ${movie.title}`,
    description: movie.overview,
  };
}

export async function generateStaticParams() {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  const paths = data.results.map((movie: Movie) => ({
    id: movie.id.toString(),
  }));
  return paths;
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movieData = getMovie(params.id);
  const creditsData = getMovieCredits(params.id);

  const [movie, credits] = await Promise.all([movieData, creditsData]);

  const producer = credits.crew.find((crew) => crew.job === "Producer");
  const director = credits.crew.find((crew) => crew.job === "Director");
  const story = credits.crew.find((crew) => crew.job === "Story");

  const crew = [producer, director, story];

  return (
    <div className="flex flex-col">
      <div className="absolute inset-0 -z-10 h-[120vh] w-full md:h-[100vh]">
        <Image
          priority={true}
          className="object-cover opacity-40"
          fill={true}
          src={baseUrl + movie.backdrop_path || movie.poster_path}
          alt={movie.title || movie.original_title}
        />
      </div>
      <div className="px-10">
        <h1 className="my-4 pt-4 text-3xl font-bold md:text-5xl">
          {movie.title}
        </h1>
        <div className="mb-4 flex items-center gap-4">
          <p className="text-2xl font-semibold italic">{movie?.tagline}</p>
          <LikeButton movie={movie} />
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-4 text-lg text-gray-300">
          <div className="flex gap-1">
            <p>⭐</p>
            <p>{Math.round(movie.vote_average * 100) / 100}%</p>
          </div>

          <span>|</span>
          <p>{movie.release_date}</p>

          <span>|</span>
          <p className="text-center">
            {movie.genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-4">
          <p className="text-xl font-semibold">
            Runtime:{" "}
            <span className="text-lg font-normal italic">
              {movie.runtime} minutes
            </span>
          </p>
          <p className="max-w-[700px] text-lg">{movie.overview}</p>
        </div>

        <Trailer movie={movie} />

        <div className="py-4">
          <h2 className="my-4 text-3xl font-semibold">Featured Crew</h2>
          <div className="flex flex-col gap-4 md:flex-row">
            {crew.map((crew, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-2 md:items-center md:text-center"
              >
                <p className="text-2xl font-semibold">{crew?.name}</p>
                <p className="text-lg italic text-gray-300">{crew?.job}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-4 pt-28">
          <h2 className="my-4 text-3xl font-semibold">Cast</h2>
          <div className="flex flex-col gap-6 lg:flex-row">
            {credits.cast
              .filter((actor) => actor.profile_path)
              .slice(0, 5)
              .map((actor, idx) => (
                <Link
                  aria-label={`Page for ${actor.name}`}
                  key={idx}
                  href={`/cast/${actor.id}`}
                  className="flex w-fit flex-col gap-2 transition hover:opacity-90 md:items-center md:text-center"
                >
                  <Image
                    className="rounded-md object-cover"
                    width={300}
                    height={400}
                    src={baseUrl + actor.profile_path}
                    alt={actor.name}
                  />

                  <p className="text-2xl font-semibold">{actor.name}</p>
                  <p className="text-lg italic text-gray-300">
                    {actor.character}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
