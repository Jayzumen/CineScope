import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MediaCardSkeleton = () => {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-slate-700 bg-slate-800/50 py-0">
      <CardHeader className="relative flex-shrink-0 overflow-hidden p-0">
        <div className="relative h-[300px] w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col p-4">
        <Skeleton className="mb-2 h-6 w-3/4" />
        <Skeleton className="mb-2 h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardContent>
    </Card>
  );
};

export default MediaCardSkeleton;
