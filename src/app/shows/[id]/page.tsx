import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Clock, Users, Award } from "lucide-react";
import LikeButton from "./LikeButton";
import Trailer from "./Trailer";
import getShow from "@/lib/getShow";
import getShowCredits from "@/lib/getShowCredits";
import { baseUrl, truncateString } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = await getShow(id);
  return {
    title: `CineScope | ${show.name}`,
    description: show.overview,
  };
}

export async function generateStaticParams() {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
  );
  const data = await response.json();
  const paths = data.results.map((show: Show) => ({
    id: show.id.toString(),
  }));
  return paths;
}

export default async function ShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const showData = getShow(id);
  const creditsData = getShowCredits(id);

  const [show, credits] = await Promise.all([showData, creditsData]);

  const exProducer = credits.crew.find(
    (crew) => crew.job === "Executive Producer",
  );
  const producer = credits.crew.find((crew) => crew.job === "Producer");
  const director = credits.crew.find((crew) => crew.job === "Series Director");
  const story = credits.crew.find((crew) => crew.job === "Characters");
  const creator = credits.crew.find((crew) => crew.job === "Creator");

  const crew = [exProducer, producer, director, story, creator];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section with Backdrop */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            priority={true}
            className="object-cover"
            fill={true}
            src={baseUrl + show.backdrop_path || show.poster_path}
            alt={show.name || show.original_name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        </div>

        <div className="relative z-10 flex min-h-[70vh] items-end px-4 pt-20 pb-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Poster */}
              <div className="flex justify-center lg:justify-start">
                <div className="relative h-[400px] w-[280px] overflow-hidden rounded-lg shadow-2xl">
                  <Image
                    className="object-cover"
                    fill
                    src={baseUrl + show.poster_path}
                    alt={show.name || show.original_name}
                    sizes="(max-width: 1024px) 280px, 280px"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-4xl font-black text-white md:text-6xl">
                      {show.name}
                    </h1>
                    {show?.tagline && (
                      <p className="mt-4 text-xl text-slate-300 italic">
                        "{show.tagline}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <LikeButton show={show} />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-slate-300">
                    <div className="flex items-center gap-2 rounded-full bg-purple-600/20 px-3 py-1">
                      <Star className="h-4 w-4 text-purple-400" />
                      <span className="font-semibold">
                        {Math.round(show.vote_average * 10) / 10}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>{show.first_air_date}</span>
                    </div>
                    {show.episode_run_time &&
                      show.episode_run_time.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>{show.episode_run_time[0]} min</span>
                        </div>
                      )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {show.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="rounded-full bg-slate-700/50 px-3 py-1 text-sm text-slate-300"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="max-w-3xl text-lg leading-relaxed text-slate-300">
                    {show.overview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <Trailer show={show} />
        </div>
      </section>

      {/* Crew Section */}
      <section className="bg-slate-800/30 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-purple-500"></div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Featured Crew
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {crew.map(
              (member, idx) =>
                member && (
                  <Card
                    key={idx}
                    className="border-slate-700 bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20">
                        <Award className="h-6 w-6 text-purple-400" />
                      </div>
                      <CardTitle className="text-lg font-semibold text-white">
                        {member.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-sm text-slate-400">
                        {member.job}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ),
            )}
          </div>
        </div>
      </section>

      {/* Cast Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-orange-500"></div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">Cast</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {credits.cast
              .filter((actor) => actor.profile_path)
              .slice(0, 10)
              .map((actor, idx) => (
                <div
                  key={actor.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <Link
                      href={`/cast/${actor.id}`}
                      aria-label={`Page for ${actor.name}`}
                      className="flex h-full flex-col"
                    >
                      <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
                        <div className="relative h-[200px] w-full">
                          <Image
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            src={baseUrl + actor.profile_path}
                            alt={actor.name}
                            title={actor.name}
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </CardHeader>
                      <CardContent className="flex flex-grow flex-col p-3">
                        <CardTitle className="mb-1 line-clamp-2 text-sm font-semibold transition-colors group-hover:text-orange-400">
                          {actor.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 flex-grow text-xs text-slate-400">
                          {actor.character}
                        </CardDescription>
                      </CardContent>
                    </Link>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
