import { Link } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import EmptyState from '@/components/EmptyState'
import { TodoText } from '@/components/Todo'
import { allPosts, formatDate } from '@/lib/content'

// One row per post, laid out like the event ledger: date, then title and summary.
export default function Blog() {
  return (
    <PageShell
      title="Blog"
      intro="Event write-ups, tutorials and project updates from BIFOSS members."
    >
      {allPosts.length ? (
        <ul className="border-b border-t-2 border-brand-rule border-t-brand-ink">
          {allPosts.map((p) => (
            <li key={p.slug} className="border-t border-brand-rule first:border-t-0">
              <Link
                to={`/blog/${p.slug}`}
                className="grid gap-1 px-2 py-5 transition-colors hover:bg-brand-wash sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-6"
              >
                <time dateTime={String(p.date).slice(0, 10)} className="text-sm text-brand-muted sm:pt-1.5">
                  {formatDate(p.date, { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
                <span>
                  <span className="block text-lg font-semibold text-brand-ink"><TodoText>{p.title}</TodoText></span>
                  {p.excerpt && (
                    <span className="mt-1 block max-w-[var(--measure)] text-brand-muted"><TodoText>{p.excerpt}</TodoText></span>
                  )}
                  {p.author && (
                    <span className="mt-1 block text-sm text-brand-muted">By <TodoText>{p.author}</TodoText></span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Posts will appear here"
          message="Event write-ups, tutorials and project updates from members will be posted here. Meanwhile, see what is coming up."
          linkTo="/events"
          linkLabel="See events"
        />
      )}
    </PageShell>
  )
}
