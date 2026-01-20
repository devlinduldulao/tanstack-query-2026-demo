import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/deduping')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/deduping"!</div>
}
