import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Layers, List, Infinity as InfinityIcon, Radio, Zap, Clock, Bookmark, Share2, Loader } from "lucide-react";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const demos = [
    {
       title: "Prefetching",
       description: "Preload data for faster navigation",
       path: "/prefetching",
       icon: <Bookmark className="h-6 w-6 text-orange-500" />
    },
    {
       title: "Deduplication",
       description: "Request deduplication with multiple subscribers",
       path: "/deduping",
       icon: <Layers className="h-6 w-6 text-blue-500" />
    },
    {
       title: "Optimistic Updates",
       description: "Immediate UI updates before server confirmation",
       path: "/optimistic-update-cache",
       icon: <Zap className="h-6 w-6 text-yellow-500" />
    },
    {
       title: "Polling",
       description: "Auto-refetching at specified intervals",
       path: "/polling",
       icon: <Clock className="h-6 w-6 text-cyan-500" />
    },
    {
       title: "Pagination",
       description: "Paginated lists with keepPreviousData",
       path: "/pagination",
       icon: <List className="h-6 w-6 text-green-500" />
    },
    {
       title: "Infinite Scrolling",
       description: "Load more data as you scroll",
       path: "/infinite-scrolling",
       icon: <InfinityIcon className="h-6 w-6 text-purple-500" />
    },
    {
       title: "Streamed Query",
       description: "Real-time AI-like streaming responses",
       path: "/streamed-query",
       icon: <Radio className="h-6 w-6 text-red-500" />
    },
    {
        title: "Broadcast",
        description: "Sync state across tabs instantly",
        path: "/broadcast",
        icon: <Share2 className="h-6 w-6 text-indigo-500" />
     },
    {
       title: "Suspense Query",
       description: "Render components with Suspense boundaries",
       path: "/suspense-query",
       icon: <Loader className="h-6 w-6 text-pink-500" />
    },
  ];

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          TanStack Query Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A collection of practical examples showcasing the power of TanStack Query with React.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo) => (
           <Link key={demo.path} to={demo.path} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50">
                 <CardHeader>
                    <div className="flex items-center justify-between">
                       <div className="p-2 bg-slate-100 rounded-lg dark:bg-slate-800">
                          {demo.icon}
                       </div>
                       <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                    </div>
                    <CardTitle className="mt-4">{demo.title}</CardTitle>
                    <CardDescription>{demo.description}</CardDescription>
                 </CardHeader>
              </Card>
           </Link>
        ))}
      </div>
    </div>
  );
}
