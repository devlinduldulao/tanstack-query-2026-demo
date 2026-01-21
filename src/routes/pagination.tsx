import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import commodityService from '@/services/commodity';
import { PulsingDot } from '@/components/PulsingDot';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/pagination')({
  component: PaginationScreen,
})

function PaginationScreen() {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isRefetching, isFetching, isError, error } = useQuery({
    queryKey: ['commodities', page, pageSize],
    queryFn: () => commodityService.getCommodities(page, pageSize),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const handleSetPage = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Page {page}</CardTitle>
          {(isFetching || isRefetching) && <PulsingDot />}
        </CardHeader>
        <CardContent>
          {isError && (
             <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-800">
               Error: {error instanceof Error ? error.message : 'Failed to load data'}
             </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetPage(page - 1)}
              disabled={page === 1 || isFetching}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex-1 text-center text-sm text-muted-foreground">
                Page {page} {data?.next ? 'of many' : ''} • Showing {data?.data.length || 0} items
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSetPage(page + 1)}
              disabled={!data?.next || isFetching}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
