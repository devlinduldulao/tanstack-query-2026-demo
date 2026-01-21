import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
// ... imports

/**
 * BROADCAST & SHARE PAGE
 * ----------------------------------------------------------------------------------
 * This route demonstrates how to synchronize application state across multiple browser
 * tabs or windows without needing a backend subscription (like WebSockets).
 * 
 * CORE CONCEPTS:
 * 1. Single Source of Truth: The Query Client holds the state.
 * 2. Event-Driven Updates: Browser events trigger updates in other tabs.
 * 3. Optimistic UI: The local tab updates instantly, while others sync milliseconds later.
 */

export const Route = createFileRoute('/broadcast')({
  component: BroadcastScreen,
})

// --- Hook Implementation (Simulating the Broadcast Client behaviors for the demo) ---
//
// CONTEXT FOR DEVELOPERS:
// In a production application using TanStack Query, cross-tab synchronization is typically handled
// by the `@tanstack/query-broadcast-client-experimental` package which uses the BroadcastChannel API.
//
// For this standalone demo, we implement a custom hook `useSharedState` that simulates this behavior
// using the `localStorage` API. The localStorage 'storage' event is unique because it ONLY fires
// in *other* tabs/windows, not the one that triggered the change, making it perfect for this simulation.

/**
 * A custom hook that creates a synchronized state across browser tabs.
 * acts like useState() but synchronizes across windows.
 */
function useSharedState<T>(key: string, initialData: T): [T, (val: T) => void] {
  const queryClient = useQueryClient();
  const queryKey = ["shared", key];

  // 1. STATE HOLDER (The Query)
  // We use useQuery to hold the state. This gives us caching, devtools inspection,
  // and a single source of truth for this tab.
  const { data } = useQuery({
    queryKey,
    queryFn: () => {
        // HYDRATION: On mount, check if there's already data in storage
        // (in case the user refreshes the page)
        const stored = localStorage.getItem(`tq-sync-${key}`);
        if (stored) {
            try {
                return JSON.parse(stored).data;
            } catch (e) { return initialData; }
        }
        return initialData;
    },
    initialData: initialData,
    staleTime: Infinity, // Data considered fresh forever (until we manually update it)
    gcTime: Infinity,    // Keep in garbage collection forever
    refetchOnWindowFocus: false, // Disable default refetching; we rely on events
  });

  // 2. THE RECEIVER (Listening for external updates)
  // This useEffect listens for the 'storage' event, which fires when
  // localStorage is modified in ANOTHER tab.
  useEffect(() => {
     const handleStorage = (event: StorageEvent) => {
        // Only react to changes for our specific key
        if (event.key === `tq-sync-${key}` && event.newValue) {
            try {
                const payload = JSON.parse(event.newValue);
                // Update the Query Cache with the new data from the other tab.
                // This will automatically trigger a re-render of this component.
                queryClient.setQueryData(queryKey, payload.data);
                toast("State synced from another tab!");
            } catch (e) { console.error(e); }
        }
     };
     window.addEventListener('storage', handleStorage);
     return () => window.removeEventListener('storage', handleStorage);
  }, [key, queryClient, queryKey]);

  // 3. THE BROADCASTER (Sending updates)
  const setState = useCallback((newData: T) => {
      // Step A: Optimistic Update
      // Update the local query cache immediately so the UI feels instant in THIS tab.
      queryClient.setQueryData(queryKey, newData);
      
      // Step B: Broadcast
      // Write to localStorage. This fires the 'storage' event in ALL OTHER open tabs,
      // triggering their listeners (defined in step 2).
      localStorage.setItem(`tq-sync-${key}`, JSON.stringify({ 
          timestamp: Date.now(),
          data: newData 
      }));
  }, [queryClient, queryKey, key]);

  return [data as T, setState];
}

function BroadcastScreen() {
  const [sharedText, setSharedText] = useSharedState<string>("demo-text", "Hello World");
  const [sharedTheme, setSharedTheme] = useSharedState<"light" | "dark" | "blue">("demo-theme", "light");
  const [lastSync] = useState(new Date());

  const getThemeStyles = (theme: string) => {
      switch(theme) {
          case 'dark': return 'bg-slate-950 text-slate-50 border-slate-800';
          case 'blue': return 'bg-blue-950 text-blue-50 border-blue-800';
          default: return 'bg-white text-slate-900 border-slate-200';
      }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      
      <div className="space-y-2">
         <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Share2 className="h-8 w-8 text-indigo-500" />
            Cross-Tab Broadcast
         </h1>
         <p className="text-xl text-muted-foreground">
            Synchronize client state across tabs instantly without a server.
         </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          
          {/* Interactive Demo Card */}
          <Card className="border-indigo-200 shadow-lg md:col-span-2 overflow-hidden">
             <div className="bg-indigo-50/50 p-4 border-b flex justify-between items-center">
                 <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                    <Laptop className="h-5 w-5" />
                    <span>Interactive Demo</span>
                 </div>
                 <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-200 animate-pulse">
                    Live Sync Active
                 </Badge>
             </div>
             
             <CardContent className="p-8 space-y-8">
                 <div className="bg-amber-50 text-amber-900 p-4 rounded-lg border border-amber-200 flex items-start gap-4">
                     <span className="text-2xl">💡</span>
                     <div>
                         <p className="font-semibold">Try it out:</p>
                         <p className="text-sm">Open this page in a <a href="/broadcast" target="_blank" className="underline font-bold text-amber-700">New Tab</a>. Change the values below and watch them sync instantly.</p>
                     </div>
                 </div>

                 <div className="grid gap-6 p-6 rounded-xl border-2 border-dashed transition-colors duration-500"
                      style={{
                          borderColor: sharedTheme === 'blue' ? '#93c5fd' : sharedTheme === 'dark' ? '#475569' : '#e2e8f0',
                          backgroundColor: sharedTheme === 'blue' ? '#eff6ff' : sharedTheme === 'dark' ? '#f8fafc' : '#ffffff' // Just subtle tint
                      }}
                 >
                     <div className="space-y-4">
                        <Label className="text-base">Shared Message</Label>
                        <div className="flex gap-2">
                            <Input 
                                value={sharedText} 
                                onChange={(e) => setSharedText(e.target.value)}
                                className="text-lg h-12"
                                placeholder="Type something..."
                            />
                            <div className="h-12 w-12 flex items-center justify-center bg-secondary rounded-md text-muted-foreground" title="Synced">
                                <RefreshCw className="h-5 w-5" />
                            </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <Label className="text-base">Shared Theme Preference</Label>
                        <RadioGroup 
                            value={sharedTheme} 
                            onValueChange={(v) => setSharedTheme(v as any)}
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
                            <div className="mt-4 text-2xl font-mono p-4 rounded bg-black/10">
                                {sharedText || '...'}
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
                      <Globe className="h-5 w-5 text-green-600" />
                      How It Works
                  </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                  <p>
                      The <strong>broadcastQueryClient</strong> utility (experimental) leverages the <code className="bg-muted px-1 py-0.5 rounded text-foreground">Broadcast Channel API</code> to synchronize the TanStack Query cache between browser tabs with the same origin.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
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
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs font-mono">
{`import { broadcastQueryClient } 
  from "@tanstack/query-broadcast-client-experimental";

const queryClient = new QueryClient();

broadcastQueryClient({
  queryClient,
  broadcastChannel: "my-app-channel",
});`}
                  </pre>
                  <p className="mt-4 text-xs text-muted-foreground">
                      This demo uses a <code className="bg-muted px-1 rounded">localStorage</code> event fallback pattern to simulate this behavior since the experimental package isn't installed in this environment.
                  </p>
              </CardContent>
          </Card>

      </div>
    </div>
  );
}

