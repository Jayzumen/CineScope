import { baseUrl } from "@/app/constants";
import { Metadata } from "next";
import Image from "next/image";
import { Show } from "../showTypes";
import LikeButton from "./LikeButton";
import Trailer from "./Trailer";

async function getShow(id: string): Promise<Show> {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&append_to_response=videos`
  );
  const data: Show = await response.json();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const show = await getShow(params.id);
  return {
    title: `CineScope | ${show.name}`,
    description: show.overview,
  };
}

export async function generateStaticParams() {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  const paths = data.results.map((show: Show) => ({
    id: show.id.toString(),
  }));
  return paths;
}

export default async function ShowPage({ params }: { params: { id: string } }) {
  const show = await getShow(params.id);
  return (
    <div className="flex flex-col">
      <div className="absolute inset-0 -z-10 h-[120vh] w-full md:h-[100vh]">
        <Image
          priority={true}
          className="object-cover opacity-40"
          fill={true}
          src={baseUrl + show.backdrop_path || show.poster_path}
          alt={show.name || show.original_name}
        />
      </div>
      <div className="px-10">
        <h1 className="my-4 pt-4 text-5xl font-bold">{show.name}</h1>
        <div className="mb-8 flex items-center  gap-4">
          <p className="text-2xl font-semibold italic">{show?.tagline}</p>
          <LikeButton show={show} />
        </div>
        <Trailer show={show} />

        <div className="mt-4 flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-4">
            <p className="text-xl font-semibold">
              First Air Date:{" "}
              <span className="text-lg font-normal italic">
                {show.first_air_date}
              </span>
            </p>
            <p className="text-xl font-semibold">
              Episode Runtime:{" "}
              <span className="text-lg font-normal italic">
                {show.episode_run_time[0]} minutes
              </span>
            </p>

            <p className="text-xl font-semibold">Plot:</p>
            <p className="max-w-[500px] text-lg">{show.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
