import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/polling/new-todo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/polling/new-todo"!</div>
}
