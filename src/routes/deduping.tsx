import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';
import SampleA from '@/components/SampleA';
import SampleB from '@/components/SampleB';
import { PulsingDot } from '@/components/PulsingDot';
import { useDedupeQuery } from '@/state/server/queries/dedupeQueries';
import dedupeService from '@/services/dedupe';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Layers, Activity } from 'lucide-react';

export const Route = createFileRoute('/deduping')({
  component: DedupingScreen,
})

function DedupingScreen() {
  const myQuery = useDedupeQuery();

  useEffect(() => {
     // Intentionally trigger a fetch to show deduplication in network tab if observed closely
     dedupeService.getUsers().then(() => console.log('Users fetched directly'));
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <Card className="border-l-4 border-l-primary shadow-sm">
        <CardHeader>
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Layers className="h-6 w-6 text-primary" />
                        Request Deduplication
                    </CardTitle>
                    <CardDescription>
                        Multiple components subscribing to the same query key trigger only a single network request.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    {myQuery.status === 'pending' ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <PulsingDot />
                            Fetching...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                            <Activity className="h-4 w-4" />
                            <span>Idle/Cached</span>
                        </div>
                    )}
                </div>
            </div>
        </CardHeader>
        <CardContent>
             <p className="text-sm text-muted-foreground">
                 Below are two independent components (<code className="bg-muted px-1 rounded">SampleA</code> and <code className="bg-muted px-1 rounded">SampleB</code>) that both hook into <code className="bg-muted px-1 rounded">useDedupeQuery</code>. Notice they load simultaneously from one request.
             </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SampleA />
        <SampleB />
      </div>
    </div>
  );
}
