"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, Heart, User as UserIcon } from "lucide-react";
import { auth, db } from "@/utils/firebase";
import { baseUrl, truncateString } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AccountDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [shows, setShows] = useState<Show[]>([]);

  useEffect(() => {
    const getUser = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    const getMovies = async (user: User) => {
      const colRef = collection(db, "users", user?.uid, "likedMovies");
      const snapshot = await getDocs(colRef);
      const movies: Movie[] = [];
      snapshot.forEach((doc) => {
        movies.push(doc.data() as Movie);
      });
      setMovies(movies);
    };
    const getShows = async (user: User) => {
      const colRef = collection(db, "users", user?.uid, "likedShows");
      const snapshot = await getDocs(colRef);
      const shows: Show[] = [];
      snapshot.forEach((doc) => {
        shows.push(doc.data() as Show);
      });
      setShows(shows);
    };

    getMovies(user);
    getShows(user);
  }, [user]);

  return (
    <div className="w-full max-w-7xl">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/20">
              <UserIcon className="h-10 w-10 text-purple-400" />
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-4xl font-black tracking-tight text-transparent md:text-6xl">
            {user?.displayName || "User"}&apos;s Account
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Your personal collection of liked movies and TV shows
          </p>
        </div>
      </section>

      <div className="space-y-16">
        {/* Liked Movies Section */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-purple-500"></div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Liked Movies
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-purple-600/20 px-3 py-1">
              <Heart className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">
                {movies.length}
              </span>
            </div>
          </div>

          {movies.length === 0 ? (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="flex flex-col items-center py-12">
                <Heart className="mb-4 h-12 w-12 text-slate-400" />
                <p className="text-center text-slate-400">
                  No liked movies yet.
                </p>
                <p className="mt-2 text-center text-sm text-slate-500">
                  Start liking movies to see them here!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {movies.map((movie, index) => {
                if (movie.poster_path)
                  return (
                    <div
                      key={movie.id}
                      className="animate-fade-in-up"
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
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="absolute top-3 right-3 rounded-full bg-purple-600 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <Star className="mr-1 inline h-3 w-3" />
                              {movie.vote_average?.toFixed(1) || "N/A"}
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-grow flex-col p-4">
                            <CardTitle className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-purple-400">
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
                  );
              })}
            </div>
          )}
        </section>

        {/* Liked Shows Section */}
        <section>
          <div className="mb-8 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-orange-500"></div>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              Liked TV Shows
            </h2>
            <div className="flex items-center gap-2 rounded-full bg-orange-600/20 px-3 py-1">
              <Heart className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-white">
                {shows.length}
              </span>
            </div>
          </div>

          {shows.length === 0 ? (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="flex flex-col items-center py-12">
                <Heart className="mb-4 h-12 w-12 text-slate-400" />
                <p className="text-center text-slate-400">
                  No liked shows yet.
                </p>
                <p className="mt-2 text-center text-sm text-slate-500">
                  Start liking TV shows to see them here!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {shows.map((show, index) => {
                if (show.poster_path)
                  return (
                    <div
                      key={show.id}
                      className="animate-fade-in-up"
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
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                              />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                            <div className="absolute top-3 right-3 rounded-full bg-orange-600 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <Star className="mr-1 inline h-3 w-3" />
                              {show.vote_average?.toFixed(1) || "N/A"}
                            </div>
                          </CardHeader>
                          <CardContent className="flex flex-grow flex-col p-4">
                            <CardTitle className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-orange-400">
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
                  );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AccountDetails;
