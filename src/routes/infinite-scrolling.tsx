import { createFileRoute } from '@tanstack/react-router'
import { useInfiniteQuery } from '@tanstack/react-query';
import commodityService from '@/services/commodity';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, PackageOpen, TrendingUp, Archive } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const Route = createFileRoute('/infinite-scrolling')({
  component: InfiniteScrollingScreen,
})

function InfiniteScrollingScreen() {
  const { ref, inView } = useInView();
  const ITEMS_PER_PAGE = 7;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ['commodities-infinite'],
    queryFn: async ({ pageParam }) => {
      return await commodityService.getCommodities(pageParam as number, ITEMS_PER_PAGE);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8 space-y-2">
           <h2 className="text-3xl font-bold tracking-tight">Infinite Inventory</h2>
            <p className="text-muted-foreground flex items-center gap-2">
                <Archive className="h-4 w-4" />
                Scroll down to automatically load more items.
            </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {status === 'pending' ? (
          Array.from({ length: 8 }).map((_, i) => (
             <Card key={i} className="overflow-hidden border-dashed">
                <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-center mt-4">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-10" />
                    </div>
                </CardContent>
             </Card>
          ))
        ) : status === 'error' ? (
           <div className="col-span-full py-12 text-center text-destructive bg-destructive/5 rounded-lg border border-destructive/20">
               <p className="font-semibold">Error: {(error as Error).message}</p>
           </div>
        ) : (
          data?.pages.map((group) => (
            group.data.map((commodity) => (
              <Card key={commodity.id} className="group overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
                <div className="h-2 w-full bg-gradient-to-r from-muted to-muted group-hover:from-primary/80 group-hover:to-primary/20 transition-all duration-500" />
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                     <Badge variant="outline" className="text-[10px] text-muted-foreground px-1.5 py-0 h-5">
                       #{commodity.id}
                     </Badge>
                     {commodity.quantity < 10 && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">Low Stock</Badge>
                     )}
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-1" title={commodity.name}>
                    {commodity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="flex items-end justify-between">
                        <div className="space-y-0.5">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Price</span>
                            <div className="text-2xl font-bold text-primary tabular-nums">
                                ${commodity.price.toFixed(2)}
                            </div>
                        </div>
                        <div className="text-right space-y-0.5">
                             <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center justify-end gap-1">
                                <PackageOpen className="h-3 w-3" /> Qty
                             </span>
                             <div className="font-medium tabular-nums">{commodity.quantity}</div>
                        </div>
                   </div>
                   
                   <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground ">
                        <span className="flex items-center gap-1 group-hover:text-primary transition-colors">
                            <TrendingUp className="h-3 w-3" />
                            Market Value
                        </span>
                        <span className="font-mono">
                            ${(commodity.price * commodity.quantity).toFixed(0)}
                        </span>
                   </div>
                </CardContent>
              </Card>
            ))
          ))
        )}
      </div>

      <div ref={ref} className="py-12 flex justify-center w-full">
         {isFetchingNextPage ? (
             <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm font-medium">Loading more items...</span>
             </div>
         ) : hasNextPage ? (
             <span className="text-xs text-muted-foreground translate-y-4 opacity-0 transition-opacity duration-1000" style={{ opacity: 0.5 }}>
                Scroll to load
             </span>
         ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50 py-8">
                <div className="h-1 w-24 bg-border rounded-full mb-4" />
                <span className="text-sm">You've reached the end of the list</span>
            </div>
         )}
      </div>
    </div>
  );
}
