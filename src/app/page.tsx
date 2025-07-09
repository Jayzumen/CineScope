import Image from "next/image";
import Link from "next/link";
import getMoviesDay from "@/lib/getMoviesDay";
import getShows from "@/lib/getTrendingShows";
import getTrendingPeople from "@/lib/getTrendingPeople";
import { baseUrl, truncateString } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, TrendingUp } from "lucide-react";

export default async function Home() {
  const [movies, shows, people] = await Promise.all([
    getMoviesDay(),
    getShows(),
    getTrendingPeople(),
  ]);

  const randomMovies = movies.sort(() => Math.random() - 0.5).slice(0, 5);
  const randomShows = shows.sort(() => Math.random() - 0.5).slice(0, 5);
  const randomPeople = people.sort(() => Math.random() - 0.5).slice(0, 6);

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-purple-600/20"></div>
          <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="animate-fade-in">
              <h1 className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-6xl font-black tracking-tight text-transparent md:text-8xl">
                CineScope
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-slate-300 md:text-2xl">
                Discover the latest in cinema and television. Explore trending
                movies, binge-worthy shows, and the stars that bring them to
                life.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/movies">
                  <Button
                    size="lg"
                    className="cursor-pointer bg-sky-600 px-8 py-3 text-lg text-white hover:bg-sky-700"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Explore Movies
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

        {/* Stats Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="animate-fade-in-up text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-600/20">
                  <Play className="h-8 w-8 text-sky-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Latest Movies
                </h2>
                <p className="text-slate-400">
                  Discover the newest releases and trending films
                </p>
              </div>
              <div
                className="animate-fade-in-up text-center"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600/20">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Popular Shows
                </h2>
                <p className="text-slate-400">
                  Binge-worthy series and trending TV content
                </p>
              </div>
              <div
                className="animate-fade-in-up text-center"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600/20">
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Celebrity Spotlight
                </h2>
                <p className="text-slate-400">
                  Meet the stars behind your favorite content
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Movies Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-sky-500"></div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Trending Movies
                </h2>
              </div>
              <Link href="/movies">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {randomMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="animate-fade-in-up h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <Link
                      href={`/movies/${movie.id}`}
                      aria-label={movie.title || movie.original_title}
                      className="flex h-full flex-col"
                    >
                      <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
                        <div className="relative h-[300px] w-full">
                          <Image
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            src={baseUrl + movie.poster_path}
                            alt={movie.title || movie.original_title}
                            title={movie.title || movie.original_title}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
                          {movie.title || movie.original_title}
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

        {/* Trending Shows Section */}
        <section className="bg-slate-800/30 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-purple-500"></div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Popular Shows
                </h2>
              </div>
              <Link href="/shows">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {randomShows.map((show, index) => (
                <div
                  key={show.id}
                  className="animate-fade-in-up h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <Link
                      href={`/shows/${show.id}`}
                      aria-label={show.name || show.original_name}
                      className="flex h-full flex-col"
                    >
                      <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
                        <div className="relative h-[300px] w-full">
                          <Image
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            src={baseUrl + show.poster_path}
                            alt={show.name || show.original_name}
                            title={show.name || show.original_name}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
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
                          {show.name || show.original_name}
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

        {/* Trending People Section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-orange-500"></div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Celebrity Spotlight
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {randomPeople.map((person, index) => (
                <div
                  key={person.id}
                  className="animate-fade-in-up h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="group flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                    <Link
                      href={`/cast/${person.id}`}
                      aria-label={person.name}
                      className="flex h-full flex-col"
                    >
                      <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
                        <div className="relative h-[200px] w-full">
                          <Image
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            src={baseUrl + person.profile_path}
                            alt={person.name}
                            title={person.name}
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </CardHeader>
                      <CardContent className="flex flex-grow flex-col p-3">
                        <CardTitle className="mb-1 line-clamp-2 text-sm font-semibold transition-colors group-hover:text-orange-400">
                          {person.name}
                        </CardTitle>
                        <CardDescription className="flex-grow text-xs text-slate-400">
                          {person.known_for_department}
                        </CardDescription>
                      </CardContent>
                    </Link>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-sky-600/20 to-purple-600/20 px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in-up">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
                Ready to Explore?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl text-xl text-slate-300">
                Dive into the world of entertainment with CineScope. Discover
                new favorites, explore detailed information, and stay updated
                with the latest releases.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/movies">
                  <Button
                    size="lg"
                    className="cursor-pointer bg-sky-600 px-8 py-3 text-lg text-white hover:bg-sky-700"
                  >
                    Start Exploring
                  </Button>
                </Link>
                <Link href="/shows">
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer border-slate-600 px-8 py-3 text-lg text-slate-300 hover:bg-slate-800"
                  >
                    Browse Shows
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
