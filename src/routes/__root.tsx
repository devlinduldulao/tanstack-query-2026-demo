import type { QueryClient } from "@tanstack/react-query";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
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
  // Apply the shared TanStack Query theme to the document root.
  useApplyTheme();

  return (
    <>
      <NavBar />
      <Outlet />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
