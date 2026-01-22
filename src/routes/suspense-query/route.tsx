import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/suspense-query")({
  component: RouteComponent,
});

function RouteComponent() {
  // no need to wrap with Suspense, as the route already does that for us through pendingComponent
  return <Outlet />;
}
