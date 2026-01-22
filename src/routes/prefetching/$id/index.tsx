import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import reportService from "@/services/report";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, FileText, Calendar, DollarSign, PieChart, Info, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/prefetching/$id/")({
  component: ReportScreen,
});

function ReportScreen() {
  const { id } = Route.useParams();

  const reportQuery = useQuery({
    queryKey: ["report", id],
    queryFn: () => reportService.getReportById(id),
    enabled: !!id,
  });

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/prefetching">
            <Button variant="ghost" size="sm" className="gap-2 pl-0 transition-all hover:pl-2">
              <ArrowLeft className="h-4 w-4" /> Back to Reports
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {reportQuery.isFetching ? (
            <Badge variant="outline" className="animate-pulse">
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Updating...
            </Badge>
          ) : (
            <Badge className="border-green-200 bg-green-100 text-green-700">Live Data</Badge>
          )}
        </div>
      </div>

      {reportQuery.isPending ? (
        <div className="text-muted-foreground flex h-[50vh] flex-col items-center justify-center">
          <Loader2 className="text-primary mb-4 h-10 w-10 animate-spin" />
          <p className="text-lg font-medium">Loading Report Data...</p>
          <p className="mt-2 text-sm font-semibold text-pink-600">(Simulated network delay)</p>
        </div>
      ) : reportQuery.isError ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="text-destructive p-8 text-center">
            <Info className="mx-auto mb-4 h-12 w-12" />
            <h2 className="text-lg font-bold">Failed to load report</h2>
            <p>{reportQuery.error.message}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="animate-in slide-in-from-bottom-4 grid gap-6 duration-500">
          <Card className="border-l-primary border-l-4 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                    <FileText className="text-primary h-8 w-8" />
                    {reportQuery.data.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-lg">
                    Comprehensive financial analysis and projections.
                  </CardDescription>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Export PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="mt-4 grid gap-4 md:grid-cols-3">
              <div className="bg-secondary/30 flex items-center gap-4 rounded-lg p-4">
                <div className="bg-background rounded-full p-2 shadow-sm">
                  <Calendar className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Fiscal Period</p>
                  <p className="text-lg font-bold">Q3 2024</p>
                </div>
              </div>
              <div className="bg-secondary/30 flex items-center gap-4 rounded-lg p-4">
                <div className="bg-background rounded-full p-2 shadow-sm">
                  <DollarSign className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Revenue</p>
                  <p className="text-lg font-bold">$1.2M</p>
                </div>
              </div>
              <div className="bg-secondary/30 flex items-center gap-4 rounded-lg p-4">
                <div className="bg-background rounded-full p-2 shadow-sm">
                  <PieChart className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Growth</p>
                  <p className="text-lg font-bold">+12.5%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Data Payload</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto rounded-lg border bg-slate-950 p-6 font-mono text-sm text-slate-50 shadow-inner">
                <pre className="whitespace-pre-wrap">{JSON.stringify(reportQuery.data, null, 2)}</pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
