export default async function getActor(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const data = await res.json();
  return data as Cast;
}
