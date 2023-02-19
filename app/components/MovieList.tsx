import Image from "next/image";
import Link from "next/link";
import { baseUrl, truncateString } from "../constants";
import { Movie } from "../page";

const getRandomMovies = (movies: Movie[], randomMovie: Movie) => {
  let randomMovies: Movie[] = [];
  while (randomMovies.length < 5) {
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

function MovieList({
  movies,
  randomMovie,
}: {
  movies: Movie[];
  randomMovie: Movie;
}) {
  const randomMovies = getRandomMovies(movies, randomMovie);

  return (
    <div className="mt-4 hidden h-fit flex-col gap-4 rounded-lg bg-slate-900 lg:flex">
      <p className="mx-auto text-2xl font-semibold">Top Movies</p>
      {randomMovies.map((movie) => (
        <Link
          href={`/movies/${movie.id}`}
          key={movie.id}
          className="flex gap-2 rounded-md p-2 transition hover:bg-slate-800"
        >
          <div className="flex flex-col justify-center gap-2">
            <p className="min-w-[280px] border-b-2 border-b-slate-700">
              {movie?.title || movie?.title || movie?.original_title}
            </p>
            <div className="flex gap-2">
              <Image
                height={150}
                width={150}
                src={`${baseUrl}${movie?.backdrop_path || movie?.poster_path}`}
                alt={movie?.title || movie?.title || movie?.original_title}
              />
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-500">{movie?.release_date}</p>
                <p className="max-w-[250px] text-sm text-slate-600">
                  {truncateString(movie?.overview, 100)}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default MovieList;
