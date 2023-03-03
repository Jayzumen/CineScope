export default async function getMoviesDay() {
  const response = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`,
    {
      next: {
        revalidate: 20,
      },
    }
  );
  const data = await response.json();
  return data.results as Movies[];
}
