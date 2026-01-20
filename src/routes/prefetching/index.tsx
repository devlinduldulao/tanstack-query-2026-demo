import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/prefetching/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/prefetching/"!</div>
}
