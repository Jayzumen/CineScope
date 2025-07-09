import { baseUrl, truncateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SearchedShows = ({ searchedShows }: { searchedShows: Shows[] }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {searchedShows &&
        searchedShows.map((show, index) => {
          if (show.poster_path)
            return (
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
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
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
            );
        })}
    </div>
  );
};

export default SearchedShows;
