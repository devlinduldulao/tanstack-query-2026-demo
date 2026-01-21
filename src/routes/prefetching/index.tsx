import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import reportService from '@/services/report';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap } from 'lucide-react';

export const Route = createFileRoute('/prefetching/')({
  component: ReportsScreen,
})

function ReportsScreen() {
  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getReports(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const queryClient = useQueryClient();
  const getCachedData = (id: string) => queryClient.getQueryData(['report', id]);

  const handlePreFetch = async (reportId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['report', String(reportId)],
      queryFn: () => reportService.getReportById(reportId),
      staleTime: Infinity,
      gcTime: Infinity,
    });
  };

  if (reportsQuery.isPending) return (
      <div className="container mx-auto p-4 space-y-4">
          <SkeletonList />
      </div>
  );
  
  if (reportsQuery.isError) return <div className="p-4 text-destructive">Error: {reportsQuery.error.message}</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
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
                    className="block group"
                    onMouseEnter={() => handlePreFetch(String(item.id))}
                 >
                     <Card className="hover:border-primary/50 transition-all hover:shadow-md border-muted">
                         <CardContent className="p-4 flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                                     {item.id}
                                 </div>
                                 <div>
                                     <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                                     <p className="text-sm text-muted-foreground">Detailed analysis for current quarter</p>
                                 </div>
                             </div>
                             
                             <div className="flex items-center gap-4">
                                  {isCached && (
                                      <Badge variant="secondary" className="bg-green-100 text-green-700 animate-in fade-in zoom-in border-green-200">
                                          Prefetched
                                      </Badge>
                                  )}
                                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                             </div>
                         </CardContent>
                     </Card>
                 </Link>
             )})}
      </div>
    </div>
  );
}

function SkeletonList() {
    return (
        <div className="space-y-4">
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="space-y-3">
                {[1,2,3].map(i => (
                    <div key={i} className="h-20 w-full bg-muted rounded-lg animate-pulse" />
                ))}
            </div>
        </div>
    )
}
