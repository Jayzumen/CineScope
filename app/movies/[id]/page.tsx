import { baseUrl } from "@/app/constants";
import { Metadata } from "next";
import Image from "next/image";
import { Movie } from "../movieTypes";
import LikeButton from "./LikeButton";
import Trailer from "./Trailer";

async function getMovie(id: string): Promise<Movie> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=videos`
  );
  const data: Movie = await response.json();
  return data;
}

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
  const movie = await getMovie(params.id);
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
        <h1 className="my-4 pt-4 text-center text-4xl font-bold">
          {movie.title}
        </h1>
        <div className="mb-8 flex items-center justify-center gap-4">
          <p className="text-2xl font-semibold italic">{movie?.tagline}</p>
          <LikeButton movie={movie} />
        </div>
        <Trailer movie={movie} />

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <p className="text-xl font-semibold">
              Release Date:{" "}
              <span className="text-lg font-normal italic">
                {movie.release_date}
              </span>
            </p>
            <p className="text-xl font-semibold">
              Runtime:{" "}
              <span className="text-lg font-normal italic">
                {movie.runtime} minutes
              </span>
            </p>

            <p className="text-xl font-semibold">Plot:</p>
            <p className="max-w-[500px] text-lg">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
