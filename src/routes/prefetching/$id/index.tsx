import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import reportService from '@/services/report';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, FileText, Calendar, DollarSign, PieChart, Info, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Route = createFileRoute('/prefetching/$id/')({
  component: ReportScreen,
})

function ReportScreen() {
  const { id } = Route.useParams();

  const reportQuery = useQuery({
    queryKey: ["report", id],
    queryFn: () => reportService.getReportById(id),
    enabled: !!id,
  });

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link to="/prefetching">
                <Button variant="ghost" size="sm" className="gap-2 pl-0 hover:pl-2 transition-all">
                    <ArrowLeft className="h-4 w-4"/> Back to Reports
                </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {reportQuery.isFetching ? (
                <Badge variant="outline" className="animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    Updating...
                </Badge>
            ) : (
                 <Badge className="bg-green-100 text-green-700 border-green-200">
                    Live Data
                </Badge>
            )}
          </div>
       </div>

      {reportQuery.isPending ? (
         <div className="flex h-[50vh] flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p className="text-lg font-medium">Loading Report Data...</p>
            <p className="text-sm text-pink-600 font-semibold mt-2">(Simulated network delay)</p>
         </div>
      ) : reportQuery.isError ? (
        <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-8 text-center text-destructive">
                 <Info className="h-12 w-12 mx-auto mb-4" />
                 <h2 className="text-lg font-bold">Failed to load report</h2>
                 <p>{reportQuery.error.message}</p>
            </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-l-4 border-l-primary shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <CardTitle className="text-3xl font-bold flex items-center gap-3">
                                <FileText className="h-8 w-8 text-primary" />
                                {reportQuery.data.title}
                             </CardTitle>
                             <CardDescription className="text-lg mt-2">
                                Comprehensive financial analysis and projections.
                             </CardDescription>
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Download className="h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-secondary/30 p-4 rounded-lg flex items-center gap-4">
                        <div className="p-2 bg-background rounded-full shadow-sm">
                             <Calendar className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Fiscal Period</p>
                            <p className="font-bold text-lg">Q3 2024</p>
                        </div>
                    </div>
                     <div className="bg-secondary/30 p-4 rounded-lg flex items-center gap-4">
                        <div className="p-2 bg-background rounded-full shadow-sm">
                             <DollarSign className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Revenue</p>
                            <p className="font-bold text-lg">$1.2M</p>
                        </div>
                    </div>
                     <div className="bg-secondary/30 p-4 rounded-lg flex items-center gap-4">
                        <div className="p-2 bg-background rounded-full shadow-sm">
                             <PieChart className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Growth</p>
                            <p className="font-bold text-lg">+12.5%</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Raw Data Payload</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-950 text-slate-50 p-6 rounded-lg overflow-auto border shadow-inner font-mono text-sm">
                        <pre className="whitespace-pre-wrap">
                            {JSON.stringify(reportQuery.data, null, 2)}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
