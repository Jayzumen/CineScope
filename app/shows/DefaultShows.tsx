import Image from "next/image";
import Link from "next/link";
import { baseUrl } from "../constants";

const DefaultShows = ({ shows }: { shows: Shows[] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-y-12 gap-x-8">
      {shows &&
        shows.map((show) => (
          <Link
            className="transition hover:opacity-80"
            aria-label={`Link to ${show.name}`}
            href={`/shows/${show.id}`}
            key={show.id}
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
        ))}
    </div>
  );
};

export default DefaultShows;
