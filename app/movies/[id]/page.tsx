import { baseUrl } from "@/app/constants";
import { Metadata } from "next";
import Image from "next/image";
import { Movie } from "../movieTypes";
import LikeButton from "./LikeButton";

async function getMovie(id: string): Promise<Movie> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
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
    <div className="relative flex flex-col">
      <div className="absolute inset-0 -z-10 h-[120vh] w-full md:h-[100vh]">
        <Image
          className="object-cover opacity-40"
          fill={true}
          src={baseUrl + movie.backdrop_path || movie.poster_path}
          alt={movie.title || movie.original_title}
        />
      </div>
      <div className="px-10">
        <h1 className="my-10 text-center text-4xl font-bold">{movie.title}</h1>
        <p className="text-xl font-semibold">Plot:</p>
        <p className="max-w-[500px] text-lg">{movie.overview}</p>
        <LikeButton movie={movie} />
      </div>
    </div>
  );
}
