import { baseUrl } from "../../constants";
import Image from "next/image";
import Link from "next/link";
import { Show, ShowDetails } from "../types";

export async function getShow(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const show: ShowDetails = await res.json();
  return show;
}

export async function generateStaticParams() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results.map((show: Show) => ({
    id: show.id.toString(),
  }));
}

export default async function ShowPage({ params }: { params: { id: string } }) {
  const show = await getShow(params.id);
  // console.log(show.seasons);
  return (
    <main className="flex flex-col justify-center ">
      {/* background Image */}
      <div className="absolute inset-0 -z-10 h-[150vh] w-full sm:h-[100vh]">
        <Image
          className="object-cover opacity-40"
          fill={true}
          src={`${baseUrl}${show?.backdrop_path || show?.poster_path}`}
          priority
          alt={show?.name || show?.original_name}
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-semibold">
          {show.name || show.original_name}
        </h1>
        <h2 className="mt-2 text-2xl italic">{show.tagline}</h2>
      </div>
      {/* Movie Detail */}
      <div className="flex flex-col gap-2 px-10">
        <p className="text-3xl font-semibold">First Air Date:</p>
        <p>{show.first_air_date}</p>

        <p className="text-3xl font-semibold">Episode Runtime:</p>
        <p>{show.episode_run_time} minutes</p>

        <p className="text-3xl font-semibold">Number of Seasons:</p>
        <p>{show.number_of_seasons}</p>

        <p className="text-3xl font-semibold">Number of Episodes:</p>
        <p>{show.number_of_episodes}</p>

        <p className="text-3xl font-semibold">Seasons:</p>
        <div className="flex max-w-[500px] gap-2">
          {show.seasons.map((season) => (
            <Link
              key={season.id}
              className="transition hover:underline"
              href={`/shows/${show.id}/${season.id}`}
            >
              {season.name}
            </Link>
          ))}
        </div>

        <p className="text-3xl font-semibold">Status:</p>
        <p>{show.status}</p>

        <p className="text-3xl font-semibold">Production Companies:</p>
        <div className="flex max-w-[500px] gap-2">
          {show.production_companies.map((company) => (
            <div key={company.id}>{company.name}</div>
          ))}
        </div>

        <p className="text-3xl font-semibold">Genres:</p>
        <div className="flex max-w-[500px] gap-2">
          {show.genres.map((genre) => (
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
        <p className="max-w-[500px]">{show.overview}</p>
      </div>
    </main>
  );
}
