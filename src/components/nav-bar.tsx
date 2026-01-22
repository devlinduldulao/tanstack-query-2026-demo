import * as React from "react"
import { Link } from "@tanstack/react-router"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle, 
} from "@/components/ui/sheet"
import { buttonVariants } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/theme-switcher"

// Matches Angular pathNames but fully expanded for React Router
const items = [
  { to: '/', label: 'Home' },
  { to: '/prefetching', label: 'Prefetching' },
  { to: '/deduping', label: 'Deduplication' },
  { to: '/optimistic-update-cache', label: 'Optimistic Update Cache' },
  { to: '/polling', label: 'Polling' },
  { to: '/pagination', label: 'Pagination' },
  { to: '/infinite-scrolling', label: 'Infinite Scroll' },
  { to: '/streamed-query', label: 'Streamed Query' },
  { to: '/broadcast', label: 'Broadcast' },
  { to: '/suspense-query/', label: 'Suspense Query' },
]

export function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="border-b bg-background sticky top-0 z-50 w-full backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4 container mx-auto">
        {/* Desktop Menu */}
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 font-bold select-none text-lg">
             <span>React Miami 26</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium lg:gap-6">
            {items.filter(i => i.to !== '/').map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition-colors hover:text-foreground/80 text-foreground/60 [&.active]:text-foreground [&.active]:font-bold"
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
              "px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            )}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <SheetTitle className="px-2 mb-4">Navigation</SheetTitle>
             <div className="px-2">
                <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                   <span className="font-bold text-lg">Query v5 Demo</span>
                </Link>
             </div>
             <div className="flex flex-col gap-4 mt-8 px-2">
                 {items.map((item) => (
                     <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary [&.active]:text-foreground [&.active]:font-bold"
                     >
                         {item.label}
                     </Link>
                 ))}
             </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
