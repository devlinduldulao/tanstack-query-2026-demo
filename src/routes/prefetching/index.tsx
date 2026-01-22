import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import reportService from "@/services/report";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";

export const Route = createFileRoute("/prefetching/")({
  component: ReportsScreen,
});

function ReportsScreen() {
  const reportsQuery = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportService.getReports(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const queryClient = useQueryClient();
  const getCachedData = (id: string) => queryClient.getQueryData(["report", id]);

  const handlePreFetch = async (reportId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ["report", String(reportId)],
      queryFn: () => reportService.getReportById(reportId),
      staleTime: Infinity,
      gcTime: Infinity,
    });
  };

  if (reportsQuery.isPending)
    return (
      <div className="container mx-auto space-y-4 p-4">
        <SkeletonList />
      </div>
    );

  if (reportsQuery.isError) return <div className="text-destructive p-4">Error: {reportsQuery.error.message}</div>;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Zap className="h-4 w-4 fill-amber-500 text-amber-500" />
          Hover over a report item to prefetch its details instantly.
        </p>
      </div>

      <div className="grid gap-3">
        {reportsQuery.data?.map((item) => {
          const isCached = !!getCachedData(String(item.id));

          return (
            <Link
              key={item.id}
              to="/prefetching/$id"
              params={{ id: String(item.id) }}
              className="group block"
              onMouseEnter={() => handlePreFetch(String(item.id))}
            >
              <Card className="hover:border-primary/50 border-muted transition-all hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded font-bold">
                      {item.id}
                    </div>
                    <div>
                      <h3 className="group-hover:text-primary text-lg font-semibold transition-colors">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">Detailed analysis for current quarter</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isCached && (
                      <Badge
                        variant="secondary"
                        className="animate-in fade-in zoom-in border-green-200 bg-green-100 text-green-700"
                      >
                        Prefetched
                      </Badge>
                    )}
                    <ArrowRight className="text-muted-foreground h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      <div className="bg-muted h-8 w-48 animate-pulse rounded" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted h-20 w-full animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
