import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import todoService from "@/services/todo";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Clock, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/polling/")({
  component: PollingScreen,
});

function PollingScreen() {
  const [inputValue, setInputValue] = useState(String(3000));
  const [isValidInput, setIsValidInput] = useState(true);

  const todoListQuery = useQuery({
    queryKey: ["todos"],
    queryFn: todoService.getTodos,
    refetchInterval: Number(inputValue),
  });

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const newValue = Number(value);

    // Allow values between 100ms and 60000ms
    if (!isNaN(newValue) && newValue >= 100 && newValue <= 60000) {
      setIsValidInput(true);
    } else {
      setIsValidInput(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Real-time Todos</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <RefreshCw className={cn("h-4 w-4", todoListQuery.isFetching && "text-primary animate-spin")} />
            Live dashboard with configurable polling
          </p>
        </div>

        <Link to="/polling/new-todo">
          <Button className="gap-2 shadow-lg" size="lg">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="h-fit shadow-sm md:col-span-1">
          <CardHeader className="bg-muted/30 pb-4">
            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium tracking-wide uppercase">
              <Clock className="h-4 w-4" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="interval">Poll Interval (ms)</Label>
              <div className="relative">
                <Input
                  id="interval"
                  type="number"
                  value={inputValue}
                  onChange={handleIntervalChange}
                  className={cn(
                    "pr-16 font-mono",
                    !isValidInput && "border-destructive focus-visible:ring-destructive",
                  )}
                />
                <span className="text-muted-foreground pointer-events-none absolute top-2.5 right-3 text-xs">ms</span>
              </div>
              {!isValidInput && (
                <p className="text-destructive animate-in slide-in-from-top-1 text-xs font-medium">
                  Must be 100 - 60000
                </p>
              )}
            </div>

            <div className="bg-secondary/50 space-y-2 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={todoListQuery.isFetching ? "default" : "outline"} className="transition-all">
                  {todoListQuery.isFetching ? "Fetching..." : "Idle"}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Update</span>
                <span className="font-mono text-xs">
                  {todoListQuery.dataUpdatedAt
                    ? new Date(todoListQuery.dataUpdatedAt).toLocaleTimeString()
                    : "--:--:--"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted shadow-sm md:col-span-2">
          <div className="max-h-[600px] overflow-auto rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 outline-border sticky top-0 z-10 outline outline-1">
                  <TableHead className="w-[60px]">#</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead className="w-[120px] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {todoListQuery.data?.map((todo, index) => (
                  <TableRow key={todo.id} className="group hover:bg-muted/20">
                    <TableCell className="text-muted-foreground font-mono text-xs">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <span
                        className={cn(
                          "group-hover:text-primary transition-colors",
                          todo.completed && "text-muted-foreground decoration-muted-foreground/50 line-through",
                        )}
                      >
                        {todo.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {todo.completed ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 border-green-200 bg-green-100 pl-1.5 text-green-700 hover:bg-green-100 dark:border-green-900 dark:bg-green-900/30 dark:text-green-400"
                        >
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
                    <TableCell colSpan={3} className="text-muted-foreground h-24 text-center">
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
