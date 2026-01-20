import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/streamed-query')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/streamed-query"!</div>
}
