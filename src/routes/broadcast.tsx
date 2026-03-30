import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { Globe, Laptop, RefreshCw, Share2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// ... imports

/**
 * BROADCAST & SHARE PAGE
 * ----------------------------------------------------------------------------------
 * This route demonstrates how to synchronize application state across multiple browser
 * tabs or windows without needing a backend subscription (like WebSockets).
 *
 * CORE CONCEPTS:
 * 1. Single Source of Truth: The Query Client holds the state.
 * 2. BroadcastChannel Sync: query cache updates are broadcast to other tabs.
 * 3. Optimistic UI: The local tab updates instantly, while others sync milliseconds later.
 */

export const Route = createFileRoute("/broadcast")({
  component: BroadcastScreen,
});

// --- Hook Implementation (Using broadcastQueryClient for cross-tab sync) ---
//
// CONTEXT FOR DEVELOPERS:
// Cross-tab synchronization is handled by `@tanstack/query-broadcast-client-experimental`
// which is set up in main.tsx. It uses the BroadcastChannel API to automatically sync
// any query cache changes to all open tabs with the same origin.
//
// The `useSharedState` hook below uses the query cache as state (via useQuery + setQueryData).
// Since broadcastQueryClient is active, calling setQueryData in one tab automatically
// pushes the update to every other open tab — no manual event wiring needed.
//
// This route intentionally avoids localStorage so it remains a pure demo of
// TanStack Query's BroadcastChannel-based synchronization.

/**
 * A custom hook that creates a synchronized state across browser tabs.
 * Acts like useState() but synchronizes across windows via broadcastQueryClient.
 *
 * HOW IT WORKS:
 * - Uses useQuery as a "state container" with caching and devtools inspection.
 * - Calls setQueryData to update state. broadcastQueryClient (set up in main.tsx)
 *   automatically pushes that cache change to all other open tabs.
 */
function useSharedState<T>(key: string, initialData: T): [T, (val: T) => void] {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["shared", key] as const, [key]);

  // 1. STATE HOLDER (The Query)
  // We use useQuery to hold the state. This gives us caching, devtools inspection,
  // and a single source of truth for this tab.
  const { data } = useQuery({
    queryKey,
    queryFn: () => initialData,
    initialData: initialData,
    staleTime: Infinity, // Data considered fresh forever (until we manually update it)
    gcTime: Infinity, // Keep in garbage collection forever
    refetchOnWindowFocus: false, // Disable default refetching; broadcastQueryClient handles sync
  });

  // 2. THE UPDATER
  // Calling setQueryData updates the local cache AND broadcastQueryClient
  // automatically broadcasts the change to every other open tab.
  const setState = useCallback(
    (newData: T) => {
      // Update the query cache — broadcastQueryClient pushes this to other tabs.
      queryClient.setQueryData(queryKey, newData);
    },
    [queryClient, queryKey],
  );

  return [data as T, setState];
}

function BroadcastScreen() {
  const [sharedText, setSharedText] = useSharedState<string>("demo-text", "Hello World");
  const [sharedTheme, setSharedTheme] = useSharedState<"light" | "dark" | "blue">("demo-theme", "light");
  // const [lastSync] = useState(new Date());

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "dark":
        return "bg-slate-950 text-slate-50 border-slate-800";
      case "blue":
        return "bg-blue-950 text-blue-50 border-blue-800";
      default:
        return "bg-white text-slate-900 border-slate-200";
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight">
          <Share2 className="h-8 w-8 text-indigo-500" />
          broadcastQueryClient Demo
        </h1>
        <p className="text-muted-foreground text-xl">
          Synchronize TanStack Query cache state across same-origin tabs with BroadcastChannel.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Interactive Demo Card */}
        <Card className="overflow-hidden border-indigo-200 shadow-lg md:col-span-2">
          <div className="flex items-center justify-between border-b bg-indigo-50/50 p-4">
            <div className="flex items-center gap-2 font-semibold text-indigo-700">
              <Laptop className="h-5 w-5" />
              <span>Interactive Demo</span>
            </div>
            <Badge variant="outline" className="animate-pulse border-indigo-200 bg-white text-indigo-700">
              Live Sync Active
            </Badge>
          </div>

          <CardContent className="space-y-8 p-8">
            <div className="flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <span className="text-2xl">💡</span>
              <div>
                <p className="font-semibold">Try it out:</p>
                <p className="text-sm">
                  Open this page in a{" "}
                  <a href="/broadcast" target="_blank" className="font-bold text-amber-700 underline">
                    New Tab
                  </a>
                  . Change the values below and watch them sync instantly.
                </p>
                <p className="mt-2 text-sm">
                  This only works between tabs on the same origin because BroadcastChannel is scoped to the current app origin.
                </p>
              </div>
            </div>

            <div
              className="grid gap-6 rounded-xl border-2 border-dashed p-6 transition-colors duration-500"
              style={{
                borderColor: sharedTheme === "blue" ? "#93c5fd" : sharedTheme === "dark" ? "#475569" : "#e2e8f0",
                backgroundColor: sharedTheme === "blue" ? "#eff6ff" : sharedTheme === "dark" ? "#f8fafc" : "#ffffff", // Just subtle tint
              }}
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
                <Label className="text-base">Shared Theme Preference</Label>
                <RadioGroup
                  value={sharedTheme}
                  onValueChange={(value) => setSharedTheme(value as "light" | "dark" | "blue")}
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
                    <RadioGroupItem value="blue" id="blue" />
                    <Label htmlFor="blue">Ocean Mode</Label>
                  </div>
                </RadioGroup>
              </div>

              <Card className={cn("transition-all duration-500", getThemeStyles(sharedTheme))}>
                <CardHeader>
                  <CardTitle>Preview Component</CardTitle>
                </CardHeader>
                <CardContent>
                  This component reflects the shared state. It will look identical in all open tabs.
                  <div className="mt-4 rounded bg-black/10 p-4 font-mono text-2xl">{sharedText || "..."}</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Explanation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
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
              This page is intentionally a pure TanStack Query demo: it does not use localStorage or any other
              persistence layer, so refreshing the page resets the state.
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
              <Zap className="h-5 w-5 text-yellow-600" />
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
              tabs via the BroadcastChannel API. Refreshing the page resets the demo because no
              persistence layer is used.
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
