import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/polling/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/polling/"!</div>
}
