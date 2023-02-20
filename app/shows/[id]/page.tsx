import { Show } from "../page";
import { truncateString } from "../../constants";

async function getShow(id: string) {
  const res = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
  );
  const show: Show = await res.json();
  return show;
}

export async function generateStaticParams() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results.map((show: Show) => ({
    id: show.id.toString(),
  }));
}

export default async function ShowPage({ params }: { params: { id: string } }) {
  const show = await getShow(params.id);
  return (
    <main>
      <h1>{show.name}</h1>
    </main>
  );
}
