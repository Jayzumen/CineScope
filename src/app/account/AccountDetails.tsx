"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/utils/firebase";
import { baseUrl } from "@/lib/utils";

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
      <h1 className="mb-8 text-center text-5xl font-semibold">
        {user?.displayName || "User"}'s Account
      </h1>

      <div className="space-y-12">
        {/* Liked Movies Section */}
        <div>
          <h2 className="mb-6 text-center text-3xl font-semibold">
            Liked Movies
          </h2>
          {movies.length === 0 ? (
            <p className="text-center text-gray-600">No liked movies yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
              {movies.map((movie) => {
                if (movie.poster_path)
                  return (
                    <Link
                      className="transition hover:opacity-80"
                      aria-label={movie.title || movie.original_title}
                      key={movie.id}
                      href={`/movies/${movie.id}`}
                    >
                      <Image
                        className="rounded-lg object-cover"
                        width={300}
                        height={400}
                        src={baseUrl + movie.poster_path || movie.backdrop_path}
                        alt={movie.title || movie.original_title}
                        title={movie.title || movie.original_title}
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <p className="mx-auto mt-2 min-h-[40px] max-w-[250px] text-xl font-semibold">
                          {movie.title || movie.original_title}
                        </p>
                        <div className="flex gap-2 text-gray-500">
                          <p className="text-sm">⭐</p>
                          <p className="text-sm">
                            {Math.round(movie.vote_average * 10) / 10}
                          </p>
                          <p className="text-sm">|</p>
                          <p className="text-sm">{movie.release_date}</p>
                        </div>
                      </div>
                    </Link>
                  );
              })}
            </div>
          )}
        </div>

        {/* Liked Shows Section */}
        <div>
          <h2 className="mb-6 text-center text-3xl font-semibold">
            Liked TV Shows
          </h2>
          {shows.length === 0 ? (
            <p className="text-center text-gray-600">No liked shows yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
              {shows.map((show) => {
                if (show.poster_path)
                  return (
                    <Link
                      className="transition hover:opacity-80"
                      aria-label={show.name || show.original_name}
                      key={show.id}
                      href={`/shows/${show.id}`}
                    >
                      <Image
                        className="rounded-lg object-cover"
                        width={300}
                        height={400}
                        src={baseUrl + show.poster_path || show.backdrop_path}
                        alt={show.name || show.original_name}
                        title={show.name || show.original_name}
                      />
                      <div className="flex flex-col items-center justify-center text-center">
                        <p className="mx-auto mt-2 min-h-[40px] max-w-[250px] text-xl font-semibold">
                          {show.name || show.original_name}
                        </p>
                        <div className="flex gap-2 text-gray-500">
                          <p className="text-sm">⭐</p>
                          <p className="text-sm">
                            {Math.round(show.vote_average * 10) / 10}
                          </p>
                          <p className="text-sm">|</p>
                          <p className="text-sm">{show.first_air_date}</p>
                        </div>
                      </div>
                    </Link>
                  );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
