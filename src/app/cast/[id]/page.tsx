import getActor from "@/lib/getActor";
import getKnownForMovie from "@/lib/getKnownForMovie";
import getKnownForTv from "@/lib/getKnownForTv";
import getTrendingPeople from "@/lib/getTrendingPeople";
import { baseUrl, truncateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FaBirthdayCake } from "react-icons/fa";
import { GiHastyGrave } from "react-icons/gi";
import { Star, Play, TrendingUp } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actor = await getActor(id);
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

export default async function CastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const actorData = getActor(id);
  const knownForMovieData = getKnownForMovie(id);
  const knownForTvData = getKnownForTv(id);

  const [actor, knownForMovie, knownForTv] = await Promise.all([
    actorData,
    knownForMovieData,
    knownForTvData,
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-purple-600/20"></div>
        <div className="relative z-10 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Actor Image */}
              <div className="animate-fade-in-up flex justify-center lg:justify-start">
                <Card className="group h-fit overflow-hidden border-slate-700 bg-slate-800/50 py-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative h-[450px] w-[300px]">
                    {actor.profile_path ? (
                      <Image
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        src={baseUrl + actor.profile_path}
                        alt={actor.name}
                        sizes="(max-width: 1024px) 100vw, 300px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-700">
                        <div className="text-center text-slate-400">
                          <div className="mb-2 text-6xl">🎭</div>
                          <p className="text-sm">No Image Available</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                </Card>
              </div>

              {/* Actor Info */}
              <div
                className="animate-fade-in-up lg:col-span-2"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="space-y-6">
                  <div>
                    <h1 className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
                      {actor.name}
                    </h1>
                    <div className="mt-4 flex flex-col gap-2 text-slate-300 md:flex-row md:items-center md:gap-6">
                      <div className="flex items-center gap-2">
                        <FaBirthdayCake className="h-5 w-5 text-orange-400" />
                        <span>{actor.birthday}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">•</span>
                        <span>{actor.place_of_birth}</span>
                      </div>
                      {actor.deathday && (
                        <>
                          <div className="flex items-center gap-2">
                            <GiHastyGrave className="h-5 w-5 text-red-400" />
                            <span>{actor.deathday}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Biography - Always visible on large screens, accordion on small screens */}
                    <div className="hidden lg:block">
                      <h2 className="text-2xl font-bold text-white">
                        Biography
                      </h2>
                      <p className="text-lg leading-relaxed text-slate-300">
                        {actor.biography || "Biography not available."}
                      </p>
                    </div>

                    {/* Accordion for small screens */}
                    <div className="lg:hidden">
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value="biography"
                          className="border-slate-700"
                        >
                          <AccordionTrigger className="text-xl font-bold text-white hover:text-slate-300 [&[data-state=open]>svg]:rotate-180">
                            <span>Biography</span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <p className="text-lg leading-relaxed text-slate-300">
                              {actor.biography || "Biography not available."}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Known For Movies Section */}
      {knownForMovie.length > 0 && (
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-sky-500"></div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Known For Movies
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {knownForMovie
                .filter((movie) => movie.poster_path)
                .slice(0, 8)
                .map((movie, index) => (
                  <div
                    key={movie.id}
                    className="animate-fade-in-up h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="group flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                      <Link
                        href={`/movies/${movie.id}`}
                        aria-label={movie.title}
                        className="flex h-full flex-col"
                      >
                        <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
                          <div className="relative h-[300px] w-full">
                            <Image
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              src={baseUrl + movie.poster_path}
                              alt={movie.title}
                              title={movie.title}
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                          <div className="absolute top-3 right-3 rounded-full bg-sky-600 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Star className="mr-1 inline h-3 w-3" />
                            {movie.vote_average?.toFixed(1) || "N/A"}
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-grow flex-col p-4">
                          <CardTitle className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-sky-400">
                            {movie.title}
                          </CardTitle>
                          <CardDescription className="mb-2 text-sm">
                            {movie.release_date}
                          </CardDescription>
                          <p className="line-clamp-3 flex-grow text-xs text-slate-400">
                            {truncateString(movie.overview, 100)}
                          </p>
                        </CardContent>
                      </Link>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Known For TV Shows Section */}
      {knownForTv.length > 0 && (
        <section className="bg-slate-800/30 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-purple-500"></div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Known For TV Shows
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {knownForTv
                .filter((show) => show.poster_path)
                .slice(0, 8)
                .map((show, index) => (
                  <div
                    key={show.id}
                    className="animate-fade-in-up h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className="group flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                      <Link
                        href={`/shows/${show.id}`}
                        aria-label={show.name}
                        className="flex h-full flex-col"
                      >
                        <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
                          <div className="relative h-[300px] w-full">
                            <Image
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                              src={baseUrl + show.poster_path}
                              alt={show.name}
                              title={show.name}
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                          <div className="absolute top-3 right-3 rounded-full bg-purple-600 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <Star className="mr-1 inline h-3 w-3" />
                            {show.vote_average?.toFixed(1) || "N/A"}
                          </div>
                        </CardHeader>
                        <CardContent className="flex flex-grow flex-col p-4">
                          <CardTitle className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-purple-400">
                            {show.name}
                          </CardTitle>
                          <CardDescription className="mb-2 text-sm">
                            {show.first_air_date}
                          </CardDescription>
                          <p className="line-clamp-3 flex-grow text-xs text-slate-400">
                            {truncateString(show.overview, 100)}
                          </p>
                        </CardContent>
                      </Link>
                    </Card>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600/20 to-purple-600/20 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in-up">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
              Explore More
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-300">
              Discover more movies, shows, and celebrities on CineScope.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/movies">
                <Button
                  size="lg"
                  className="cursor-pointer bg-sky-600 px-8 py-3 text-lg text-white hover:bg-sky-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Browse Movies
                </Button>
              </Link>
              <Link href="/shows">
                <Button
                  variant="outline"
                  size="lg"
                  className="cursor-pointer border-slate-600 px-8 py-3 text-lg text-slate-300 hover:bg-slate-800"
                >
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Browse Shows
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
