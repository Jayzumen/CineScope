import { baseUrl } from "@/app/constants";
import getKnownForMovie from "@/lib/getKnownForMovie";
import getActor from "@/lib/getActor";
import Image from "next/image";
import Link from "next/link";
import { FaBirthdayCake } from "react-icons/fa";
import { GiHastyGrave } from "react-icons/gi";
import getTrendingPeople from "@/lib/getTrendingPeople";
import getKnownForTv from "@/lib/getKnownForTv";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const actor = await getActor(params.id);
  return {
    title: `CineScope | ${actor.name}`,
    description: actor.biography,
  };
}

export async function generateStaticParams() {
  const people = await getTrendingPeople();
  const paths = people.map((person) => ({
    id: person.id.toString(),
  }));
  return paths;
}

export default async function CastPage({ params }: { params: { id: string } }) {
  const actorData = getActor(params.id);
  const knownForMovieData = getKnownForMovie(params.id);
  const knownForTvData = getKnownForTv(params.id);

  const [actor, knownForMovie, knownForTv] = await Promise.all([
    actorData,
    knownForMovieData,
    knownForTvData,
  ]);

  return (
    <main className="mt-10 flex flex-col gap-4 p-10 lg:flex-row">
      <div className="flex h-fit justify-center py-10 lg:w-[30%]">
        <Image
          width={300}
          height={450}
          src={baseUrl + actor.profile_path}
          alt={actor.name}
        />
      </div>
      <div className="items-center p-2 text-center lg:w-[70%] lg:items-start lg:text-start">
        <h1 className="text-4xl font-semibold">{actor.name}</h1>
        <div className="text-md flex flex-col items-center gap-2 text-gray-400 lg:items-start">
          <p className="flex items-center gap-2">
            <FaBirthdayCake size={20} /> {actor.birthday} |{" "}
            {actor.place_of_birth}
          </p>
          {actor.deathday ? (
            <p className="flex items-center gap-2">
              <GiHastyGrave size={20} />
              {actor.deathday}
            </p>
          ) : null}
        </div>
        <p className="max-w-[1000px] py-4 text-lg lg:py-8">{actor.biography}</p>

        <div className="mt-12 flex flex-col gap-2">
          <h2 className="py-2 text-2xl font-semibold">Known For</h2>
          {/* Movies */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:items-start lg:justify-start">
            {knownForMovie
              .filter((movie) => movie.poster_path)
              .slice(0, 4)
              .map((movie) => (
                <Link
                  aria-label={movie.title}
                  key={movie.id}
                  href={`/movies/${movie.id}`}
                  className="transition hover:opacity-90"
                >
                  <Image
                    width={200}
                    height={300}
                    src={baseUrl + movie.poster_path}
                    alt={movie.title}
                  />
                  <p className="mx-auto max-w-[200px] py-2 text-center text-xl text-gray-400">
                    {movie.title}
                  </p>
                </Link>
              ))}
          </div>
          {/* TV Shows */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:items-start lg:justify-start">
            {knownForTv
              .filter((show) => show.poster_path)
              .slice(0, 4)
              .map((show) => (
                <Link
                  aria-label={show.name}
                  key={show.id}
                  href={`/shows/${show.id}`}
                  className="transition hover:opacity-90"
                >
                  <Image
                    width={200}
                    height={300}
                    src={baseUrl + show.poster_path}
                    alt={show.name}
                  />
                  <p className="mx-auto max-w-[200px] py-2 text-center text-xl text-gray-400">
                    {show.name}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}
