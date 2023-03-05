export default async function getTrendingPeople() {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await res.json();
  return data.results as People[];
}
