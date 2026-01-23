import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

// Matches Angular pathNames but fully expanded for React Router
const items = [
  { to: "/", label: "Home" },
  { to: "/prefetching", label: "Prefetching" },
  { to: "/deduping", label: "Deduplication" },
  { to: "/optimistic-update-cache", label: "Optimistic Update Cache" },
  { to: "/polling", label: "Polling" },
  { to: "/pagination", label: "Pagination" },
  { to: "/infinite-scrolling", label: "Infinite Scroll" },
  { to: "/streamed-query", label: "Streamed Query" },
  { to: "/broadcast", label: "Broadcast" },
  { to: "/suspense-query/", label: "Suspense Query" },
];

export function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="brutal-border-thick brutal-shadow-lg bg-background sticky top-0 z-50 w-full border-b-0 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Desktop Menu */}
        <div className="mr-4 hidden md:flex">
          <Link
            to="/"
            className="font-display text-primary mr-8 flex items-center space-x-2 text-2xl font-black tracking-tight uppercase transition-transform hover:scale-105"
          >
            <span className="brutal-shadow bg-primary text-primary-foreground rounded px-3 py-1">2026</span>
            <span>React Miami</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase lg:gap-3">
            {items
              .filter((i) => i.to !== "/")
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="brutal-border brutal-shadow hover:brutal-shadow-lg text-foreground/80 hover:text-foreground [&.active]:bg-primary [&.active]:text-primary-foreground rounded px-3 py-1.5 transition-all hover:-translate-y-0.5 [&.active]:font-black"
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>

        {/* Theme Switcher */}
        <div className="ml-auto flex items-center">
          <div className="brutal-border rounded">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "brutal-border brutal-shadow hover:bg-primary hover:text-primary-foreground ml-4 px-2 text-base focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
            )}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="brutal-border-thick pr-0">
            <SheetTitle className="font-display mb-6 px-2 text-2xl font-black uppercase">Navigation</SheetTitle>
            <div className="px-2">
              <Link
                to="/"
                className="font-display flex items-center text-xl font-black uppercase"
                onClick={() => setIsOpen(false)}
              >
                <span className="brutal-shadow bg-primary text-primary-foreground rounded px-2 py-1">TQ</span>
                <span className="ml-2">Demo</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-3 px-2">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="brutal-border brutal-shadow hover:brutal-shadow-lg text-muted-foreground hover:text-foreground [&.active]:bg-primary [&.active]:text-primary-foreground rounded px-3 py-2 text-sm font-bold tracking-wide uppercase transition-all hover:-translate-x-1 [&.active]:font-black"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
