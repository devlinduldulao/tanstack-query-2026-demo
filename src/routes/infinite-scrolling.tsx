import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/infinite-scrolling')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/infinite-scrolling"!</div>
}
