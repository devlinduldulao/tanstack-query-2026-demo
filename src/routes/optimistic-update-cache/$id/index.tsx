import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/optimistic-update-cache/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/optimistic-update-cache/$id/"!</div>
}
