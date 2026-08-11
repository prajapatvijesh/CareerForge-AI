
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => {
  return (
    <div className="container max-w-7xl mx-auto py-10 px-6 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-3 mb-10">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>

      {/* Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Stats & Activity) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          
          {/* Recent Activity */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-40 mb-4" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
          
          {/* Recommendations */}
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
