"use client";

import { auth, db } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { baseUrl } from "../constants";
import { Movie } from "../movies/movieTypes";

const AccountDetails = () => {
  const [user, setUser] = useState<User | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

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
    getMovies(user);
  }, [user]);

  return (
    <div className="">
      <h1 className="mb-8 text-3xl font-bold">{user?.displayName}' page</h1>
      <div className="flex flex-wrap gap-8">
        {movies.map((movie) => (
          <Link
            aria-label={`Link to ${movie.title} page`}
            key={movie.id}
            href={`/movies/${movie.id}`}
          >
            <Image
              className="rounded-md object-cover"
              height={600}
              width={400}
              src={baseUrl + movie.poster_path || movie.backdrop_path}
              alt={movie.title || movie.original_title}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AccountDetails;
