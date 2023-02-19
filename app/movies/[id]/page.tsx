import { Movie } from "@/app/page";

async function getMovie(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const movie: Movie = await res.json();
  return movie;
}

export async function generateStaticParams() {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await res.json();
  return data.results.map((movie: Movie) => ({
    id: movie.id.toString(),
  }));
}

export default async function MoviesPage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await getMovie(params.id);
  return (
    <main>
      <h1>{movie.title}</h1>
    </main>
  );
}
