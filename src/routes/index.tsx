import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ArrowRight,
  Layers,
  List,
  Infinity as InfinityIcon,
  Radio,
  Zap,
  Clock,
  Bookmark,
  Share2,
  Loader,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

function IndexComponent() {
  const demos = [
    {
      title: "Prefetching",
      description: "Preload data for faster navigation",
      path: "/prefetching",
      icon: <Bookmark className="h-8 w-8" />,
      color: "bg-[oklch(0.85_0.15_40)]", // Yellow
    },
    {
      title: "Deduplication",
      description: "Request deduplication with multiple subscribers",
      path: "/deduping",
      icon: <Layers className="h-8 w-8" />,
      color: "bg-[oklch(0.70_0.22_270)]", // Purple
    },
    {
      title: "Optimistic Updates",
      description: "Immediate UI updates before server confirmation",
      path: "/optimistic-update-cache",
      icon: <Zap className="h-8 w-8" />,
      color: "bg-[oklch(0.85_0.15_40)]", // Yellow
    },
    {
      title: "Polling",
      description: "Auto-refetching at specified intervals",
      path: "/polling",
      icon: <Clock className="h-8 w-8" />,
      color: "bg-[oklch(0.75_0.20_140)]", // Green
    },
    {
      title: "Pagination",
      description: "Paginated lists with keepPreviousData",
      path: "/pagination",
      icon: <List className="h-8 w-8" />,
      color: "bg-[oklch(0.75_0.20_140)]", // Green
    },
    {
      title: "Infinite Scrolling",
      description: "Load more data as you scroll",
      path: "/infinite-scrolling",
      icon: <InfinityIcon className="h-8 w-8" />,
      color: "bg-[oklch(0.70_0.22_270)]", // Purple
    },
    {
      title: "Streamed Query",
      description: "Real-time AI-like streaming responses",
      path: "/streamed-query",
      icon: <Radio className="h-8 w-8" />,
      color: "bg-[oklch(0.75_0.20_340)]", // Pink/Red
    },
    {
      title: "Broadcast",
      description: "Sync state across tabs instantly",
      path: "/broadcast",
      icon: <Share2 className="h-8 w-8" />,
      color: "bg-[oklch(0.75_0.20_340)]", // Pink/Red
    },
    {
      title: "Suspense Query",
      description: "Render components with Suspense boundaries",
      path: "/suspense-query",
      icon: <Loader className="h-8 w-8" />,
      color: "bg-[oklch(0.70_0.22_270)]", // Purple
    },
  ];

  return (
    <div className="container mx-auto space-y-12 p-8 pb-24">
      <div className="space-y-6 text-center">
        <h1 className="font-display text-5xl font-black tracking-tight uppercase lg:text-7xl">
          <span className="brutal-shadow brutal-border-thick bg-primary text-primary-foreground inline-block -rotate-2 px-6 py-3">
            TanStack
          </span>
          <br />
          <span className="text-foreground mt-4 inline-block rotate-1">Query Demo</span>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg font-bold tracking-wide uppercase">
          A collection of practical examples showcasing the power of TanStack Query with React.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo, idx) => (
          <Link
            key={demo.path}
            to={demo.path}
            className="animate-brutal-slide-in group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <Card className="brutal-border-thick brutal-shadow-lg hover:brutal-shadow-xl h-full transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className={`brutal-border brutal-shadow flex h-16 w-16 items-center justify-center rounded ${demo.color} text-foreground transition-transform group-hover:scale-110 group-hover:rotate-6`}
                  >
                    {demo.icon}
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary h-8 w-8 transition-transform group-hover:translate-x-2" />
                </div>
                <CardTitle className="font-display mt-6 text-2xl font-black uppercase">{demo.title}</CardTitle>
                <CardDescription className="text-base font-bold">{demo.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
