import { ExternalLink } from 'lucide-react'
import PageShell from '@/components/PageShell'
import EmptyState from '@/components/EmptyState'
import { TodoText } from '@/components/Todo'
import projectData from '@/data/projects.json'

// Entries still carrying a TODO placeholder are not shown to visitors.
const projects = projectData.filter((p) => p.title && !String(p.title).startsWith('TODO'))

const statusLabel = { planned: 'Planned', active: 'In progress', done: 'Shipped' }

// One row per project: title and status on the left, one line and the repository on the right.
export default function Projects() {
  return (
    <PageShell title="Projects" intro="Open source projects built by club members. Planned ones are looking for contributors.">
      {projects.length === 0 ? (
        <EmptyState
          title="Projects will be listed here"
          message="Each project will show its status, a one-line summary and a link to its repository. Want to start one? Join BIFOSS."
          linkTo="/join"
          linkLabel="Join BIFOSS"
        />
      ) : (
        <ul className="border-b border-t-2 border-brand-rule border-t-brand-ink">
          {projects.map((p) => (
            <li
              key={p.title}
              className="grid gap-2 border-t border-brand-rule py-6 first:border-t-0 sm:grid-cols-[minmax(0,17rem)_1fr] sm:gap-8"
            >
              <div>
                <h2 className="text-lg font-semibold text-brand-ink"><TodoText>{p.title}</TodoText></h2>
                {p.status && (
                  <p className="mt-1 text-sm font-semibold text-brand-orange-ink">
                    <span className="sr-only">Status: </span>
                    {statusLabel[p.status] || p.status}
                  </p>
                )}
              </div>
              <div>
                <p className="text-brand-muted"><TodoText>{p.description}</TodoText></p>
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm"
                  >
                    View repository
                    <span className="sr-only"> for {p.title} (opens in a new tab)</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
