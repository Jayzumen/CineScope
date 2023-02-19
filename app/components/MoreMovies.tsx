import Image from "next/image";
import Link from "next/link";
import React from "react";
import { baseUrl } from "../constants";
import { Movie } from "../page";

const getRandomMovies = (movies: Movie[], randomMovie: Movie) => {
  let randomMovies: Movie[] = [];
  while (randomMovies.length < 4) {
    const randomIndex = movies[Math.floor(Math.random() * movies.length)];
    if (
      !randomMovies.includes(randomIndex) &&
      randomIndex.id !== randomMovie.id
    ) {
      randomMovies.push(randomIndex);
    }
  }
  return randomMovies;
};

function MoreMovies({
  movies,
  randomMovie,
}: {
  movies: Movie[];
  randomMovie: Movie;
}) {
  const randomMovies = getRandomMovies(movies, randomMovie);

  return (
    <div className="flex gap-2 pt-8">
      {randomMovies.map((movie) => (
        <Link
          href={`/movies/${movie.id}`}
          key={movie.id}
          className="relative flex h-[350px] w-[350px] gap-2 rounded-md p-2"
        >
          <div className="absolute inset-0 h-[250px] w-full">
            <Image
              className="rounded-md object-cover"
              fill={true}
              src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
              priority
              alt={movie?.title || movie?.title || movie?.original_title}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default MoreMovies;
