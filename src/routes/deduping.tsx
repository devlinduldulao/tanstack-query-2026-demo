import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import SampleA from "@/components/sample-a";
import SampleB from "@/components/sample-b";
import { PulsingDot } from "@/components/pulsing-dot";
import { useDedupeQuery } from "@/state/server/queries/dedupeQueries";
import dedupeService from "@/services/dedupe";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layers, Activity } from "lucide-react";

export const Route = createFileRoute("/deduping")({
  component: DedupingScreen,
});

function DedupingScreen() {
  const myQuery = useDedupeQuery();

  useEffect(() => {
    // Intentionally trigger a fetch to show deduplication in network tab if observed closely
    dedupeService.getUsers().then(() => console.log("Users fetched directly"));
  }, []);

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <Card className="border-l-primary border-l-4 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <Layers className="text-primary h-6 w-6" />
                Request Deduplication
              </CardTitle>
              <CardDescription>
                Multiple components subscribing to the same query key trigger only a single network request.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {myQuery.status === "pending" ? (
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <PulsingDot />
                  Fetching...
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-600">
                  <Activity className="h-4 w-4" />
                  <span>Idle/Cached</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Below are two independent components (<code className="bg-muted rounded px-1">SampleA</code> and{" "}
            <code className="bg-muted rounded px-1">SampleB</code>) that both hook into{" "}
            <code className="bg-muted rounded px-1">useDedupeQuery</code>. Notice they load simultaneously from one
            request.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SampleA />
        <SampleB />
      </div>
    </div>
  );
}
