import BackgroundImage from "./components/BackgroundImage";
import Footer from "./components/Footer";
import MovieDetail from "./components/MovieDetail";
import MovieList from "./components/MovieList";
import { Movie } from "./movies/types";

async function getMovies() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const movies = await res.json();
  const results = movies.results as Movie[];
  return results;
}

export default async function Home() {
  const movies = await getMovies();
  const randomMovie = movies[Math.floor(Math.random() * movies?.length)];

  return (
    <>
      <main className="pb-10">
        {/* Background Image */}
        <BackgroundImage randomMovie={randomMovie} />
        {/* Display of Movies */}
        <div className="flex flex-col px-4 py-4 md:px-20">
          {/* Page Title */}
          <p className="max-w-[500px] pb-4 text-5xl font-semibold md:text-7xl">
            Welcome to <span className="text-sky-900">CineScope</span>
          </p>

          <div className="flex justify-between">
            {/* Movie List */}
            <MovieList movies={movies} randomMovie={randomMovie} />

            {/* Movie Detail */}
            <MovieDetail randomMovie={randomMovie} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
