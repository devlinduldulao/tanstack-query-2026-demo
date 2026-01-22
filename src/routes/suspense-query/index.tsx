import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { reportQueries } from '@/state/server/queries/reportQueries'
import { ReportsSkeleton } from './-skeletons/reports-skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const Route = createFileRoute('/suspense-query/')({
  component: RouteComponent,
  pendingComponent: ReportsSkeleton,
  loader: async ({ context }) => {
    // adding async and await here will show blank page when users refresh the browser
    await context.queryClient.ensureQueryData(reportQueries.list())
  },
})

function RouteComponent() {
  const { data: reports } = useSuspenseQuery(reportQueries.list())

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Suspense Query - Reports</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
                  <TableCell>{report.description}</TableCell>
                  <TableCell>{report.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
