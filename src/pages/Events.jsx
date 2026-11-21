import { useMemo, useState } from 'react'
import PageShell from '@/components/PageShell'
import EventLedger from '@/components/EventLedger'
import EmptyState from '@/components/EmptyState'
import { splitEvents } from '@/lib/content'

// One connected control, one choice at a time. Buttons keep a 44px target.
function TypeFilter({ types, value, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filter by type"
      className="mb-10 inline-flex max-w-full overflow-x-auto rounded-lg border border-brand-muted p-1"
    >
      {['all', ...types].map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          aria-pressed={value === t}
          className={`min-h-[44px] whitespace-nowrap rounded-md px-4 text-sm font-semibold capitalize transition-colors ${
            value === t ? 'bg-brand-ink text-brand-paper' : 'text-brand-ink hover:bg-brand-wash'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function Section({ heading, items, emptyText }) {
  return (
    <section className="mt-14 first:mt-0">
      <h2 className="headline mb-6 text-xl sm:text-2xl">{heading}</h2>
      {items.length ? <EventLedger events={items} /> : <p className="border-t-2 border-brand-ink pt-6 text-brand-muted">{emptyText}</p>}
    </section>
  )
}

export default function Events() {
  const { upcoming, past } = useMemo(() => splitEvents(), [])
  const [type, setType] = useState('all')
  const types = useMemo(
    () => [...new Set([...upcoming, ...past].map((e) => e.type).filter(Boolean))],
    [upcoming, past]
  )
  const keep = (e) => type === 'all' || e.type === type
  const filtering = type !== 'all'
  const none = upcoming.length + past.length === 0

  return (
    <PageShell
      title="Events"
      intro="Workshops, talks and hackathons. Bring a laptop and build something. All levels are welcome."
    >
      {none ? (
        <EmptyState
          title="Events will be listed here"
          message="Each workshop, talk and hackathon will appear with its date, venue and a way to register. Join BIFOSS and we will tell you first."
          linkTo="/join"
          linkLabel="Join BIFOSS"
        />
      ) : (
        <>
          {types.length > 1 && <TypeFilter types={types} value={type} onChange={setType} />}
          <Section
            heading="Upcoming"
            items={upcoming.filter(keep)}
            emptyText={filtering ? `No upcoming ${type} events. Choose another type.` : 'Nothing is scheduled right now. New dates will appear here.'}
          />
          <Section
            heading="Past"
            items={past.filter(keep)}
            emptyText={filtering ? `No past ${type} events. Choose another type.` : 'Sessions we have run will be listed here.'}
          />
        </>
      )}
    </PageShell>
  )
}
