import { useDedupeQuery } from '@/state/server/queries/dedupeQueries';
import { PulsingDot } from './pulsing-dot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SampleB() {
  const myQuery = useDedupeQuery();

  return (
    <Card className='w-full'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Sample-B Component</CardTitle>
        {myQuery.status === 'pending' && <PulsingDot />}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Another component subscribing to the same query.
        </div>
      </CardContent>
    </Card>
  );
}
