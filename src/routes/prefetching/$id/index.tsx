import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/prefetching/$id/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/prefetching/$id/"!</div>
}
