"use client";

import { auth } from "@/utils/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
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

  return (
    <div>
      <h1 className="text-3xl font-bold">{user?.displayName}' page</h1>
    </div>
  );
};

export default AccountDetails;
