export default function MovieHead({ params }: { params: { id: string } }) {
  return (
    <>
      <title>{`CineScope | ${params.id}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={`${params.id}`} />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
