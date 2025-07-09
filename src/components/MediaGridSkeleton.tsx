import MediaCardSkeleton from "./MediaCardSkeleton";

interface MediaGridSkeletonProps {
  count?: number;
}

const MediaGridSkeleton = ({ count = 10 }: MediaGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, index) => (
        <MediaCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MediaGridSkeleton;
