import MediaCard from "./MediaCard";

interface MediaGridProps<T> {
  items: T[];
  getMediaCardProps: (
    item: T,
    index: number,
  ) => {
    id: number;
    title: string;
    originalTitle: string;
    posterPath: string;
    releaseDate: string;
    overview: string;
    voteAverage: number;
    href: string;
    index: number;
  };
}

const MediaGrid = <T,>({ items, getMediaCardProps }: MediaGridProps<T>) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items &&
        items.map((item, index) => {
          const props = getMediaCardProps(item, index);
          return <MediaCard key={props.id} {...props} />;
        })}
    </div>
  );
};

export default MediaGrid;
