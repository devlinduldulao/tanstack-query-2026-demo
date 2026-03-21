import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const demoItems = items.filter((i) => i.to !== "/");
  const visibleItems = demoItems.slice(0, 3);
  const overflowItems = demoItems.slice(3);

  return (
    <nav className="brutal-border-thick brutal-shadow-lg bg-background sticky top-0 z-50 w-full border-b-0 backdrop-blur">
      <div className="container mx-auto flex h-16 min-w-0 items-center px-4">
        {/* Desktop Menu */}
        <div className="mr-4 hidden min-w-0 flex-1 items-center lg:flex">
          <Link
            to="/"
            className="font-display text-primary mr-4 flex shrink-0 items-center space-x-2 text-2xl font-black tracking-tight uppercase transition-transform hover:scale-105 lg:mr-8"
          >
            <span className="brutal-shadow bg-primary text-primary-foreground rounded px-3 py-1">2026</span>
            <span>React Miami</span>
          </Link>
          <nav className="flex min-w-0 flex-1 items-center gap-2 text-sm font-bold tracking-wide uppercase lg:gap-3">
            {visibleItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="brutal-border brutal-shadow hover:brutal-shadow-lg text-foreground/80 hover:text-foreground [&.active]:bg-primary [&.active]:text-primary-foreground rounded px-3 py-1.5 transition-all hover:-translate-y-0.5 [&.active]:font-black"
              >
                {item.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                className="brutal-border brutal-shadow hover:brutal-shadow-lg text-foreground/80 hover:text-foreground data-open:bg-primary data-open:text-primary-foreground flex cursor-pointer items-center gap-1 rounded px-3 py-1.5 transition-all hover:-translate-y-0.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                More <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="brutal-border-thick brutal-shadow-lg p-2 min-w-48">
                {overflowItems.map((item) => (
                  <DropdownMenuItem key={item.to} className="p-0 mb-1 last:mb-0">
                    <Link
                      to={item.to}
                      className="block w-full px-3 py-2 text-sm font-bold uppercase tracking-wide cursor-pointer hover:bg-accent hover:text-accent-foreground outline-none rounded-md [&.active]:text-primary [&.active]:bg-primary/10 [&.active]:font-black"
                    >
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Theme Switcher */}
        <div className="ml-auto flex shrink-0 items-center">
          <div className="brutal-border rounded">
            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "brutal-border brutal-shadow hover:bg-primary hover:text-primary-foreground ml-4 px-2 text-base focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden",
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
