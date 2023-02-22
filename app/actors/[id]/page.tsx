import { baseUrl } from "@/app/constants";
import { getActor } from "@/app/getData";
import Image from "next/image";
import { Actor } from "../types";

export async function generateStaticParams() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/person/week?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
  );
  const data = await res.json();
  return data.results.map((actor: Actor) => ({
    id: actor.id.toString(),
  }));
}

export default async function ActorPage({
  params,
}: {
  params: { id: string };
}) {
  const actor = await getActor(params.id);
  return (
    <main className="flex flex-col justify-center gap-4 px-10">
      <h1 className="text-center text-4xl font-semibold">{actor.name}</h1>
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <section className="flex flex-col justify-center gap-2 text-center">
          <Image
            height={350}
            width={350}
            src={`${baseUrl}${actor.profile_path}`}
            alt={actor.name}
          />
          <p>Birthday: {actor.birthday}</p>
          {actor.deathday && <p>Deathday: {actor.deathday}</p>}

          <p>Place of Birth: {actor.place_of_birth}</p>
        </section>
        <section>
          <p className="text-xl">Biography:</p>
          <p className="mx-auto max-w-[800px]">{actor.biography}</p>
        </section>
      </div>
    </main>
  );
}
