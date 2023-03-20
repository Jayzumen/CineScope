import getMovies from "@/lib/getTrendingMovies";
import { Metadata } from "next";
import SearchForm from "./SearchForm";

export const metadata: Metadata = {
  title: "CineScope | Movies",
  description: "The movies page for CineScope",
};

export default async function MoviesPage() {
  const movies: Movies[] = await getMovies();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-10">
      <h1 className="mb-8 text-center text-5xl font-semibold">Movies</h1>
      <SearchForm movies={movies} />
    </div>
  );
}
