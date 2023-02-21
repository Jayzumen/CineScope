import Link from "next/link";
import { truncateString } from "../constants";
import { Movie } from "../movies/types";

function MovieDetail({ randomMovie }: { randomMovie: Movie }) {
  return (
    <div className="mt-44 flex h-fit max-w-[400px] flex-col gap-2 rounded-lg bg-slate-900 bg-opacity-30 p-2 shadow-lg shadow-slate-700">
      <div className="flex flex-col gap-2">
        <p className="text-2xl font-semibold md:text-4xl">
          {randomMovie?.title ||
            randomMovie?.title ||
            randomMovie?.original_title}
        </p>
        <p className="text-sm text-slate-500">{randomMovie?.release_date}</p>
        <p>{truncateString(randomMovie?.overview, 200)}</p>
        <Link
          className="w-fit rounded-md bg-slate-900 px-4 py-2 text-xl font-semibold shadow-md shadow-slate-700 transition hover:bg-slate-800"
          href={`/movies/${randomMovie?.id}`}
        >
          More
        </Link>
      </div>
    </div>
  );
}

export default MovieDetail;
