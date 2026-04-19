import { usePostsQuery } from "@/state/server/queries/dedupeQueries";
import { PulsingDot } from "./pulsing-dot";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUsers } from "@/hooks/use-users";

export default function SampleB() {
  
  // tanstack query
  const posts = usePostsQuery();

  useUsers();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Sample-B Component</CardTitle>
        {posts.status === "pending" && <PulsingDot />}
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground text-sm">Another component subscribing to the same query.</div>
      </CardContent>
    </Card>
  );
}
