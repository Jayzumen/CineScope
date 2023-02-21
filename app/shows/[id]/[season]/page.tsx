import { baseUrl } from "@/app/constants";
import Image from "next/image";
import { Season, ShowDetails } from "../../types";

async function getShow(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const show: ShowDetails = await res.json();
  return show;
}

export default async function SeasonsPage({
  params,
}: {
  params: { id: string; season: string };
}) {
  const show = await getShow(params.id);

  const season: Season | undefined = show?.seasons?.find(
    (season) => season.id === parseInt(params.season)
  );
  console.log(season);

  return (
    <main className="flex flex-col justify-center ">
      {/* background Image */}
      <div className="absolute inset-0 -z-10 h-[150vh] w-full sm:h-[100vh]">
        <Image
          className="object-cover opacity-40"
          fill={true}
          src={`${baseUrl}${season?.poster_path}`}
          priority
          alt={season?.name as string}
        />
      </div>

      <div className="text-center">
        <h1 className="text-5xl font-semibold">
          {show.name || show.original_name}
        </h1>
        <h2 className="text-5xl font-semibold">{season?.name}</h2>
      </div>
      <div className="flex flex-col gap-2 px-10">
        <p className="text-3xl font-semibold">Plot:</p>
        <p className="mt-2 max-w-[500px] text-2xl italic">{season?.overview}</p>

        <p className="text-3xl font-semibold">Air Date:</p>
        <p>{season?.air_date}</p>

        <p className="text-3xl font-semibold">Episode Count:</p>
        <p>{season?.episode_count}</p>
      </div>
    </main>
  );
}
