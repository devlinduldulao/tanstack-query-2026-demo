import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/optimistic-update-cache/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/optimistic-update-cache/"!</div>
}
