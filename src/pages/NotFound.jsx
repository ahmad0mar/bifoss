import { Link } from 'react-router-dom'
import PageShell from '@/components/PageShell'

// Says what went wrong and gives one way out. Used for unknown addresses and,
// with its own wording, for an event or post that does not exist.
export default function NotFound({
  title = "We can't find that page",
  message = 'The link may be old or mistyped. Check the address, or start from the home page.',
  linkTo = '/',
  linkLabel = 'Go to the home page',
}) {
  return (
    <PageShell title={title} titleTag="Page not found" intro={message} description="This page does not exist.">
      <Link to={linkTo} className="btn-brand">
        {linkLabel}
      </Link>
    </PageShell>
  )
}
