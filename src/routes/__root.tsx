import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { NavBar } from "@/components/nav-bar";
import { useApplyTheme } from "@/state/client/themeStore";

type RouterContextType = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContextType>()({
  component: RootComponent,
});

// enable the devtools if you are debugging tanstack routing and query issues
function RootComponent() {
  // Apply theme from store to document root
  const theme = useApplyTheme();
  
  useEffect(() => {
    // Re-apply theme on mount and when it changes
    document.documentElement.classList.remove('light', 'dark', 'dim');
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
