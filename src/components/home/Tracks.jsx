import { tracks } from '@/data/home'
import ScrollReveal from '@/components/ScrollReveal'

// A list, not a feature grid: track name on the left, one line on the right.
// Shared by the Home page and the About page.
export function TrackList() {
  return (
    <ul className="border-b border-brand-rule">
      {tracks.map((t) => (
        <li
          key={t.title}
          className="grid gap-1 border-t border-brand-rule py-5 sm:grid-cols-[minmax(0,17rem)_1fr] sm:gap-8"
        >
          <h3 className="text-lg font-semibold text-brand-ink">{t.title}</h3>
          <p className="text-brand-muted">{t.body}</p>
        </li>
      ))}
    </ul>
  )
}

export default function Tracks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <ScrollReveal as="h2" className="headline text-2xl sm:text-3xl md:text-4xl">Find your corner</ScrollReveal>
      <ScrollReveal className="mt-4 max-w-2xl text-brand-muted">
        Pick one track or try several. Every track ends with something you can show.
      </ScrollReveal>
      <div className="mt-10">
        <TrackList />
      </div>
    </section>
  )
}
