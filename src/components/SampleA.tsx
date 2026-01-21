import { useDedupeQuery } from '@/state/server/queries/dedupeQueries';
import { PulsingDot } from './PulsingDot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SampleA() {
  const myQuery = useDedupeQuery();

  return (
    <Card className='w-full'>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Sample-A Component</CardTitle>
        {myQuery.status === 'pending' && <PulsingDot />}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Sample component subscribing to the same query.
        </div>
      </CardContent>
    </Card>
  );
}
