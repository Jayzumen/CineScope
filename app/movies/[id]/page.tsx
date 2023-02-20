import { baseUrl } from "@/app/constants";
import { Movie } from "@/app/page";
import Image from "next/image";
import Link from "next/link";

interface MovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

async function getMovie(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const movie: MovieDetail = await res.json();
  return movie;
}

export async function generateStaticParams() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results.map((movie: MovieDetail) => ({
    id: movie.id.toString(),
  }));
}

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);
  // console.log(movie);
  return (
    <main className="flex flex-col justify-center ">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10 h-[150vh] w-full sm:h-[100vh]">
        <Image
          className="object-cover opacity-40"
          fill={true}
          src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
          priority
          alt={movie?.title || movie?.title || movie?.original_title}
        />
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-semibold">{movie.title}</h1>
        <h2 className="mt-2 text-2xl italic">{movie.tagline}</h2>
      </div>
      {/* Movie Detail */}
      <div className="flex flex-col gap-2 px-10">
        <p className="text-3xl font-semibold">Release Date:</p>
        <p>{movie.release_date}</p>

        <p className="text-3xl font-semibold">Runtime:</p>
        <p>{movie.runtime} minutes</p>

        <p className="text-3xl font-semibold">Status:</p>
        <p>{movie.status}</p>

        <p className="text-3xl font-semibold">Production Companies:</p>
        <div className="flex max-w-[500px] gap-2">
          {movie.production_companies.map((company) => (
            <div key={company.id}>{company.name}</div>
          ))}
        </div>

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
      </div>
    </main>
  );
}
