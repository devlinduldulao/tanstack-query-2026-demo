import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Globe, Laptop, RefreshCw, Share2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useThemeStore, type Theme } from "@/state/client/themeStore";
import { cn } from "@/lib/utils";
// ... imports

/**
 * BROADCAST & SHARE PAGE
 * ----------------------------------------------------------------------------------
 * This route demonstrates TanStack Query cache synchronization across same-origin tabs.
 *
 * MDN RELATIONSHIP:
 * - The browser primitive is the Broadcast Channel API described on MDN.
 * - This route does not call `new BroadcastChannel()` directly.
 * - TanStack's `broadcastQueryClient`, configured once in main.tsx, owns the low-level
 *   channel wiring so this file can focus on query-cache state.
 */

export const Route = createFileRoute("/broadcast")({
  component: BroadcastScreen,
});

// Cross-tab synchronization is provided by `broadcastQueryClient` in main.tsx.
// This hook uses the query cache as shared state, and TanStack broadcasts cache updates
// across same-origin tabs through the browser's BroadcastChannel API.

/**
 * A custom hook that creates a synchronized state across browser tabs.
 * It behaves like useState(), but stores the value in the query cache so cache updates
 * can be broadcast to other tabs by `broadcastQueryClient`.
 */
function useSharedState<T>(key: string, initialData: T): [T, (val: T) => void] {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["shared", key] as const, [key]);

  const { data } = useQuery({
    queryKey,
    queryFn: () => initialData,
    initialData: initialData,
    staleTime: Infinity, // Data considered fresh forever (until we manually update it)
    gcTime: Infinity, // Keep in garbage collection forever
    refetchOnWindowFocus: false, // Disable default refetching; broadcastQueryClient handles sync
  });

  const setState = useCallback(
    (newData: T) => {
      queryClient.setQueryData(queryKey, newData);
    },
    [queryClient, queryKey],
  );

  return [data as T, setState];
}

function getThemeStyles(theme: Theme) {
  switch (theme) {
    case "dark":
      return "border-slate-700 bg-slate-950 text-slate-50";
    case "dim":
      return "border-slate-600 bg-slate-800 text-slate-100";
    default:
      return "border-border bg-card text-card-foreground";
  }
}

function getCanvasStyles(theme: Theme) {
  switch (theme) {
    case "dark":
      return "border-slate-600 bg-slate-900/70 text-slate-100";
    case "dim":
      return "border-slate-500 bg-slate-800/60 text-slate-100";
    default:
      return "border-border/80 bg-background/80 text-foreground";
  }
}

function BroadcastScreen() {
  const [sharedText, setSharedText] = useSharedState<string>("demo-text", "Hello World");
  const { theme: sharedTheme, setTheme: setSharedTheme } = useThemeStore();
  // const [lastSync] = useState(new Date());

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight">
          <Share2 className="dim:text-indigo-300 h-8 w-8 text-indigo-500 dark:text-indigo-400" />
          broadcastQueryClient Demo
        </h1>
        <p className="text-muted-foreground text-xl">
          Synchronize TanStack Query cache state across same-origin tabs with BroadcastChannel.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Interactive Demo Card */}
        <Card className="border-primary/25 overflow-hidden shadow-lg md:col-span-2">
          <div className="bg-primary/10 border-border/60 flex items-center justify-between border-b p-4">
            <div className="text-primary flex items-center gap-2 font-semibold">
              <Laptop className="h-5 w-5" />
              <span>Interactive Demo</span>
            </div>
            <Badge variant="outline" className="border-primary/30 bg-background text-primary animate-pulse">
              Live Sync Active
            </Badge>
          </div>

          <CardContent className="space-y-8 p-8">
            <div className="dim:border-amber-800 dim:bg-amber-900/35 dim:text-amber-100 flex items-start gap-4 rounded-lg border border-amber-300/70 bg-amber-50/85 p-4 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-semibold">Try it out:</p>
                <p className="text-sm">
                  Open this page in a{" "}
                  <a
                    href="/broadcast"
                    target="_blank"
                    className="dim:text-amber-200 font-bold text-amber-800 underline underline-offset-2 dark:text-amber-300"
                  >
                    New Tab
                  </a>
                  . Change the values below and watch them sync instantly.
                </p>
                <p className="mt-2 text-sm">
                  This only works between tabs on the same origin because BroadcastChannel is scoped to the current app
                  origin.
                </p>
              </div>
            </div>

            <div
              className={cn(
                "grid gap-6 rounded-xl border-2 border-dashed p-6 transition-colors duration-500",
                getCanvasStyles(sharedTheme),
              )}
            >
              <div className="space-y-4">
                <Label className="text-base">Shared Message</Label>
                <div className="flex gap-2">
                  <Input
                    value={sharedText}
                    onChange={(e) => setSharedText(e.target.value)}
                    className="h-12 text-lg"
                    placeholder="Type something..."
                  />
                  <div
                    className="bg-secondary text-muted-foreground flex h-12 w-12 items-center justify-center rounded-md"
                    title="Synced"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base">App Theme Preference</Label>
                <RadioGroup
                  value={sharedTheme}
                  onValueChange={(value) => setSharedTheme(value as Theme)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <Label htmlFor="light">Light Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <Label htmlFor="dark">Dark Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dim" id="dim" />
                    <Label htmlFor="dim">Dim Mode</Label>
                  </div>
                </RadioGroup>
              </div>

              <Card className={cn("transition-all duration-500", getThemeStyles(sharedTheme))}>
                <CardHeader>
                  <CardTitle>Preview Component</CardTitle>
                </CardHeader>
                <CardContent>
                  This component reflects the shared state. It will look identical in all open tabs.
                  <div className="mt-4 rounded border border-current/10 bg-black/10 p-4 font-mono text-2xl">
                    {sharedText || "..."}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Explanation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="dim:text-green-300 h-5 w-5 text-green-600 dark:text-green-400" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4 text-sm">
            <p>
              The <strong>broadcastQueryClient</strong> utility (experimental) leverages the{" "}
              <code className="bg-muted text-foreground rounded px-1 py-0.5">Broadcast Channel API</code> to synchronize
              the TanStack Query cache between browser tabs with the same origin.
            </p>
            <p>
              The shared message on this page is intentionally a pure TanStack Query demo, so refreshing resets that
              field. The theme control is different: it is wired to the app-wide shared theme, so changing it here also
              updates the header theme switcher and any other open tab.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>One tab updates the query cache.</li>
              <li>The change is broadcasted via a named channel.</li>
              <li>Other tabs receive the message and update their cache silently.</li>
              <li>React Components re-render immediately with the new data.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Code Snippet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="dim:text-yellow-300 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              Production Setup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-xs text-slate-50">
              {`// main.tsx — runs once at app startup
import { broadcastQueryClient }
  from "@tanstack/query-broadcast-client-experimental";

const queryClient = new QueryClient();

broadcastQueryClient({
  queryClient,
  broadcastChannel: "tanstack-query-demo",
});

// Any component — setQueryData syncs to all tabs
queryClient.setQueryData(["shared", "text"], "Hi!");`}
            </pre>
            <p className="text-muted-foreground mt-4 text-xs">
              This demo uses the real <code className="bg-muted rounded px-1">broadcastQueryClient</code> utility
              configured in <code className="bg-muted rounded px-1">main.tsx</code>. Any{" "}
              <code className="bg-muted rounded px-1">setQueryData</code> call is automatically broadcast to all open
              tabs via the BroadcastChannel API. Refreshing the page resets the demo because no persistence layer is
              used.
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              The package is experimental, so production apps should pin it to a patch version to avoid unexpected
              breaking changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
