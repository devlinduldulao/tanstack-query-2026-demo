import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import commodityService from "@/services/commodity";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, PackageOpen, TrendingUp, Archive } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/infinite-scrolling")({
  component: InfiniteScrollingScreen,
});

function InfiniteScrollingScreen() {
  const { ref, inView } = useInView();
  const ITEMS_PER_PAGE = 7;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } = useInfiniteQuery({
    queryKey: ["commodities-infinite"],
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
    <div className="container mx-auto max-w-6xl p-4">
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Infinite Inventory</h2>
        <p className="text-muted-foreground flex items-center gap-2">
          <Archive className="h-4 w-4" />
          Scroll down to automatically load more items.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {status === "pending" ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-dashed">
              <CardHeader className="pb-2">
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-10" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : status === "error" ? (
          <div className="text-destructive bg-destructive/5 border-destructive/20 col-span-full rounded-lg border py-12 text-center">
            <p className="font-semibold">Error: {(error as Error).message}</p>
          </div>
        ) : (
          data?.pages.map((group) =>
            group.data.map((commodity) => (
              <Card
                key={commodity.id}
                className="group hover:border-primary/50 overflow-hidden transition-all hover:shadow-md"
              >
                <div className="from-muted to-muted group-hover:from-primary/80 group-hover:to-primary/20 h-2 w-full bg-gradient-to-r transition-all duration-500" />
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-muted-foreground h-5 px-1.5 py-0 text-[10px]">
                      #{commodity.id}
                    </Badge>
                    {commodity.quantity < 10 && (
                      <Badge variant="destructive" className="h-5 px-1.5 py-0 text-[10px]">
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-1 text-lg font-semibold" title={commodity.name}>
                    {commodity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="space-y-0.5">
                      <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Price</span>
                      <div className="text-primary text-2xl font-bold tabular-nums">${commodity.price.toFixed(2)}</div>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="text-muted-foreground flex items-center justify-end gap-1 text-xs font-medium tracking-wider uppercase">
                        <PackageOpen className="h-3 w-3" /> Qty
                      </span>
                      <div className="font-medium tabular-nums">{commodity.quantity}</div>
                    </div>
                  </div>

                  <div className="text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 text-xs">
                    <span className="group-hover:text-primary flex items-center gap-1 transition-colors">
                      <TrendingUp className="h-3 w-3" />
                      Market Value
                    </span>
                    <span className="font-mono">${(commodity.price * commodity.quantity).toFixed(0)}</span>
                  </div>
                </CardContent>
              </Card>
            )),
          )
        )}
      </div>

      <div ref={ref} className="flex w-full justify-center py-12">
        {isFetchingNextPage ? (
          <div className="text-muted-foreground flex animate-pulse flex-col items-center gap-2">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-sm font-medium">Loading more items...</span>
          </div>
        ) : hasNextPage ? (
          <span
            className="text-muted-foreground translate-y-4 text-xs opacity-0 transition-opacity duration-1000"
            style={{ opacity: 0.5 }}
          >
            Scroll to load
          </span>
        ) : (
          <div className="text-muted-foreground/50 flex flex-col items-center gap-2 py-8">
            <div className="bg-border mb-4 h-1 w-24 rounded-full" />
            <span className="text-sm">You've reached the end of the list</span>
          </div>
        )}
      </div>
    </div>
  );
}
