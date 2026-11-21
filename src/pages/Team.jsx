import { useState } from 'react'
import { Github } from 'lucide-react'
import PageShell from '@/components/PageShell'
import EmptyState from '@/components/EmptyState'
import { TodoText } from '@/components/Todo'
import teamData from '@/data/team.json'

// Entries still carrying a TODO placeholder are not shown to visitors.
const team = teamData.filter((m) => m.name && !String(m.name).startsWith('TODO'))

const initials = (name) =>
  String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

// Every portrait is the same square crop. With no photo, or a photo that fails to load,
// the member's initials fill the same square.
function Portrait({ member }) {
  const [failed, setFailed] = useState(false)
  if (member.photo && !failed) {
    return (
      <img
        src={member.photo}
        alt={member.alt || `Photo of ${member.name}`}
        width={400}
        height={400}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="aspect-square w-full rounded-lg object-cover"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="headline flex aspect-square w-full items-center justify-center rounded-lg bg-brand-wash text-3xl text-brand-ink sm:text-4xl"
    >
      {initials(member.name)}
    </div>
  )
}

export default function Team() {
  return (
    <PageShell title="Team" intro="The students who organise sessions, mentor newcomers and keep the club running.">
      {team.length === 0 ? (
        <EmptyState
          title="Team members will be listed here"
          message="We are putting together the page for the students who run BIFOSS. Meanwhile, read about the club."
          linkTo="/about"
          linkLabel="About BIFOSS"
        />
      ) : (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {team.map((m) => (
            <li key={m.name}>
              <Portrait member={m} />
              <p className="mt-3 font-semibold text-brand-ink"><TodoText>{m.name}</TodoText></p>
              <p className="text-sm text-brand-muted"><TodoText>{m.role}</TodoText></p>
              {m.github && (
                <a
                  href={m.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on GitHub (opens in a new tab)`}
                  className="mt-1 inline-flex min-h-[44px] min-w-[44px] items-center text-brand-orange-ink transition-colors hover:text-brand-orange-ink-hover"
                >
                  <Github className="h-5 w-5" aria-hidden="true" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
