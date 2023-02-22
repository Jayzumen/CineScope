import { getActor } from "@/app/getData";

export default async function ActorHead({
  params,
}: {
  params: { id: string };
}) {
  const actor = await getActor(params.id);
  return (
    <>
      <title>{`CineScope | ${actor.name}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`Page of ${actor.name}`} />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
