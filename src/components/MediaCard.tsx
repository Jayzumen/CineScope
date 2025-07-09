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

interface MediaCardProps {
  id: number;
  title: string;
  originalTitle: string;
  posterPath: string;
  releaseDate: string;
  overview: string;
  voteAverage: number;
  href: string;
  index: number;
}

const MediaCard = ({
  title,
  originalTitle,
  posterPath,
  releaseDate,
  overview,
  voteAverage,
  href,
  index,
}: MediaCardProps) => {
  if (!posterPath) return null;

  return (
    <div
      className="animate-fade-in-up h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Card className="group flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <Link
          href={href}
          aria-label={title || originalTitle}
          className="flex h-full flex-col"
        >
          <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
            <div className="relative h-[300px] w-full">
              <Image
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                src={baseUrl + posterPath}
                alt={title || originalTitle}
                title={title || originalTitle}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute top-3 right-3 rounded-full bg-purple-600 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Star className="mr-1 inline h-3 w-3" />
              {voteAverage?.toFixed(1) || "N/A"}
            </div>
          </CardHeader>
          <CardContent className="flex flex-grow flex-col p-4">
            <CardTitle className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-purple-400">
              {title || originalTitle}
            </CardTitle>
            <CardDescription className="mb-2 text-sm">
              {releaseDate}
            </CardDescription>
            <p className="line-clamp-3 flex-grow text-xs text-slate-400">
              {truncateString(overview, 100)}
            </p>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};

export default MediaCard;
