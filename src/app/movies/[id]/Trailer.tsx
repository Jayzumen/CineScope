"use client";

import { useState } from "react";
import { Play, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrailerModal from "./TrailerModal";

const Trailer = ({ movie }: { movie: Movie }) => {
  const [isOpen, setIsOpen] = useState(false);

  const trailer: Video | undefined = movie.videos.results.find(
    (video) => video.type === "Trailer",
  );

  if (!trailer) {
    return null;
  }

  return (
    <>
      <Card className="mx-auto max-w-2xl border-slate-700 bg-slate-800/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
            <Film className="h-6 w-6 text-purple-400" />
            Watch Trailer
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="group relative cursor-pointer overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-purple-800 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <Play className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
            Watch Official Trailer
          </Button>
        </CardContent>
      </Card>
      <TrailerModal isOpen={isOpen} setIsOpen={setIsOpen} trailer={trailer} />
    </>
  );
};

export default Trailer;
