import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import todoService from '@/services/todo';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Clock, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/polling/')({
  component: PollingScreen,
})

function PollingScreen() {
  const [intervalMs, setIntervalMs] = useState(3000);
  const [inputValue, setInputValue] = useState(String(3000));
  const [isValidInput, setIsValidInput] = useState(true);

  const todoListQuery = useQuery({
    queryKey: ['todos'],
    queryFn: todoService.getTodos,
    refetchInterval: Number(inputValue),
  });

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const newValue = Number(value);

    // Allow values between 100ms and 60000ms
    if (!isNaN(newValue) && newValue >= 100 && newValue <= 60000) {
      setIntervalMs(newValue);
      setIsValidInput(true);
    } else {
      setIsValidInput(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
             <h1 className="text-3xl font-bold tracking-tight">Real-time Todos</h1>
             <p className="text-muted-foreground flex items-center gap-2">
                <RefreshCw className={cn("h-4 w-4", todoListQuery.isFetching && "animate-spin text-primary")} />
                Live dashboard with configurable polling
             </p>
        </div>
          
        <Link to="/polling/new-todo">
             <Button className="shadow-lg gap-2" size="lg">
                 <Plus className="h-4 w-4"/>
                 New Task
             </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 shadow-sm h-fit">
           <CardHeader className="bg-muted/30 pb-4">
               <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Configuration
               </CardTitle>
           </CardHeader>
           <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="interval">Poll Interval (ms)</Label>
                    <div className="relative">
                        <Input 
                            id="interval"
                            type="number"
                            value={inputValue}
                            onChange={handleIntervalChange}
                            className={cn("pr-16 font-mono", !isValidInput && "border-destructive focus-visible:ring-destructive")}
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                            ms
                        </span>
                    </div>
                    {!isValidInput && (
                        <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1">
                            Must be 100 - 60000
                        </p>
                    )}
                </div>

                <div className="rounded-lg bg-secondary/50 p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status</span>
                        <Badge variant={todoListQuery.isFetching ? "default" : "outline"} className="transition-all">
                            {todoListQuery.isFetching ? "Fetching..." : "Idle"}
                        </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                         <span className="text-muted-foreground">Last Update</span>
                         <span className="font-mono text-xs">
                             {todoListQuery.dataUpdatedAt ? new Date(todoListQuery.dataUpdatedAt).toLocaleTimeString() : '--:--:--'}
                         </span>
                    </div>
                </div>
           </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm border-muted">
            <div className="max-h-[600px] overflow-auto rounded-md">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40 sticky top-0 outline outline-1 outline-border z-10">
                        <TableHead className="w-[60px]">#</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead className="w-[120px] text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {todoListQuery.data?.map((todo, index) => (
                        <TableRow key={todo.id} className="group hover:bg-muted/20">
                            <TableCell className="font-mono text-muted-foreground text-xs">{index + 1}</TableCell>
                            <TableCell className="font-medium">
                                <span className={cn("group-hover:text-primary transition-colors", todo.completed && "text-muted-foreground line-through decoration-muted-foreground/50")}>
                                    {todo.title}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                {todo.completed ? (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 gap-1 pl-1.5 border-green-200 dark:border-green-900">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Done
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground gap-1 pl-1.5">
                                        <Circle className="h-3 w-3" />
                                        Pending
                                    </Badge>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {!todoListQuery.data?.length && !todoListQuery.isError && (
                         <TableRow>
                             <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                 No tasks found. Create one!
                             </TableCell>
                         </TableRow>
                    )}
                </TableBody>
            </Table>
            </div>
        </Card>
      </div>
    </div>
  );
}
