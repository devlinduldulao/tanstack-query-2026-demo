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
    <nav className="bg-background supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Desktop Menu */}
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 text-lg font-bold select-none">
            <span>React Miami 26</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium lg:gap-6">
            {items
              .filter((i) => i.to !== "/")
              .map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground transition-colors [&.active]:font-bold"
                >
                  {item.label}
                </Link>
              ))}
          </nav>
        </div>

        {/* Theme Switcher */}
        <div className="ml-auto flex items-center">
          <ThemeSwitcher />
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetTitle className="mb-4 px-2">Navigation</SheetTitle>
            <div className="px-2">
              <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                <span className="text-lg font-bold">Query v5 Demo</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-col gap-4 px-2">
              {items.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-primary [&.active]:text-foreground text-sm font-medium transition-colors [&.active]:font-bold"
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
