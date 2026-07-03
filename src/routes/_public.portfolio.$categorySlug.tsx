import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/portfolio/$categorySlug')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/portfolio/$categorySlug"!</div>
}
