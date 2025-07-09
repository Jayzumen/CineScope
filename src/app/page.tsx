import Image from "next/image";
import Link from "next/link";
import getMoviesDay from "@/lib/getMoviesDay";
import getShows from "@/lib/getTrendingShows";
import getTrendingPeople from "@/lib/getTrendingPeople";
import { baseUrl, truncateString } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, TrendingUp } from "lucide-react";

export default async function Home() {
  const [movies, shows, people] = await Promise.all([
    getMoviesDay(),
    getShows(),
    getTrendingPeople()
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
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                CineScope
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Discover the latest in cinema and television. Explore trending movies, 
                binge-worthy shows, and the stars that bring them to life.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/movies">
                  <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 text-lg cursor-pointer">
                    <Play className="mr-2 h-5 w-5" />
                    Explore Movies
                  </Button>
                </Link>
                <Link href="/shows">
                  <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg cursor-pointer">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Browse Shows
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center animate-fade-in-up">
                <div className="bg-sky-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-sky-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Latest Movies</h3>
                <p className="text-slate-400">Discover the newest releases and trending films</p>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-purple-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Popular Shows</h3>
                <p className="text-slate-400">Binge-worthy series and trending TV content</p>
              </div>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-orange-600/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Celebrity Spotlight</h3>
                <p className="text-slate-400">Meet the stars behind your favorite content</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Movies Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-sky-500 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Trending Movies</h2>
              </div>
              <Link href="/movies">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 cursor-pointer">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {randomMovies.map((movie, index) => (
                <div 
                  key={movie.id} 
                  className="animate-fade-in-up h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="group py-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/50 border-slate-700 overflow-hidden h-full flex flex-col">
                    <Link href={`/movies/${movie.id}`} aria-label={movie.title || movie.original_title} className="flex flex-col h-full">
                      <CardHeader className="p-0 relative overflow-hidden flex-shrink-0">
                        <div className="relative w-full h-[300px]">
                          <Image
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            src={baseUrl + movie.poster_path}
                            alt={movie.title || movie.original_title}
                            title={movie.title || movie.original_title}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-sky-600 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Star className="h-3 w-3 inline mr-1" />
                          {movie.vote_average?.toFixed(1) || 'N/A'}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-sky-400 transition-colors">
                          {movie.title || movie.original_title}
                        </CardTitle>
                        <CardDescription className="text-sm mb-2">
                          {movie.release_date}
                        </CardDescription>
                        <p className="text-xs text-slate-400 line-clamp-3 flex-grow">
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
        <section className="py-16 px-4 bg-slate-800/30">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Popular Shows</h2>
              </div>
              <Link href="/shows">
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800 cursor-pointer">
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {randomShows.map((show, index) => (
                <div 
                  key={show.id} 
                  className="animate-fade-in-up h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="group py-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/50 border-slate-700 overflow-hidden h-full flex flex-col">
                    <Link href={`/shows/${show.id}`} aria-label={show.name || show.original_name} className="flex flex-col h-full">
                      <CardHeader className="p-0 relative overflow-hidden flex-shrink-0">
                        <div className="relative w-full h-[300px]">
                          <Image
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            src={baseUrl + show.poster_path}
                            alt={show.name || show.original_name}
                            title={show.name || show.original_name}
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Star className="h-3 w-3 inline mr-1" />
                          {show.vote_average?.toFixed(1) || 'N/A'}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 flex flex-col flex-grow">
                        <CardTitle className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
                          {show.name || show.original_name}
                        </CardTitle>
                        <CardDescription className="text-sm mb-2">
                          {show.first_air_date}
                        </CardDescription>
                        <p className="text-xs text-slate-400 line-clamp-3 flex-grow">
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
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Celebrity Spotlight</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {randomPeople.map((person, index) => (
                <div 
                  key={person.id} 
                  className="animate-fade-in-up h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="group py-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-slate-800/50 border-slate-700 overflow-hidden h-full flex flex-col text-center">
                    <Link href={`/cast/${person.id}`} aria-label={person.name} className="flex flex-col h-full">
                      <CardHeader className="p-0 relative overflow-hidden flex-shrink-0">
                        <div className="relative w-full h-[200px]">
                          <Image
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            src={baseUrl + person.profile_path}
                            alt={person.name}
                            title={person.name}
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </CardHeader>
                      <CardContent className="p-3 flex flex-col flex-grow">
                        <CardTitle className="text-sm font-semibold mb-1 line-clamp-2 group-hover:text-orange-400 transition-colors">
                          {person.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400 flex-grow">
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
        <section className="py-20 px-4 bg-gradient-to-r from-sky-600/20 to-purple-600/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Explore?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Dive into the world of entertainment with CineScope. Discover new favorites, 
                explore detailed information, and stay updated with the latest releases.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/movies">
                  <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 text-lg cursor-pointer">
                    Start Exploring
                  </Button>
                </Link>
                <Link href="/shows">
                  <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg cursor-pointer">
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
