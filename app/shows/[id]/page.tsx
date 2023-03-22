import { baseUrl } from "@/app/constants";
import getShow from "@/lib/getShow";
import getShowCredits from "@/lib/getShowCredits";
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
  const showData = getShow(params.id);
  const creditsData = getShowCredits(params.id);

  const [show, credits] = await Promise.all([showData, creditsData]);

  const exProducer = credits.crew.find(
    (crew) => crew.job === "Executive Producer"
  );
  const producer = credits.crew.find((crew) => crew.job === "Producer");
  const director = credits.crew.find((crew) => crew.job === "Series Director");
  const story = credits.crew.find((crew) => crew.job === "Characters");
  const creator = credits.crew.find((crew) => crew.job === "Creator");

  const crew = [exProducer, producer, director, story, creator];

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
        <h1 className="my-4 pt-4 text-3xl font-bold md:text-5xl">
          {show.name}
        </h1>
        <div className="mb-4 flex items-center gap-4">
          <p className="text-2xl font-semibold italic">{show?.tagline}</p>
          <LikeButton show={show} />
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-4 text-lg text-gray-300 ">
          <div className="flex gap-1">
            <p>⭐</p>
            <p>{Math.round(show.vote_average * 100) / 100}%</p>
          </div>
          <span>|</span>
          <p>{show.first_air_date}</p>
          <span>|</span>
          <p className="text-center">
            {show.genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-4">
          <p className="text-xl font-semibold">
            Episode Runtime:{" "}
            <span className="text-lg font-normal italic">
              {show.episode_run_time} minutes
            </span>
          </p>
          <p className="max-w-[700px] text-lg">{show.overview}</p>
        </div>
        <Trailer show={show} />

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
