import { steps } from '@/data/home'
import JoinButton from '@/components/JoinButton'
import ScrollReveal from '@/components/ScrollReveal'

// The only place on the site that is a real sequence, so the numbers stay.
export default function HowToJoin() {
  return (
    <section id="how-to-join" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20">
      <ScrollReveal as="h2" className="headline text-2xl sm:text-3xl md:text-4xl">Five steps, no gatekeeping</ScrollReveal>
      <ol className="mt-10 max-w-2xl">
        {steps.map((s, i) => (
          <li key={s.title} className="relative pb-9 pl-14 last:pb-0">
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute bottom-0 left-[1.0625rem] top-10 w-px bg-brand-rule" />
            )}
            <span className="absolute left-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-orange-fill text-sm font-bold text-brand-ink">
              {i + 1}
            </span>
            <h3 className="pt-1 text-lg font-semibold text-brand-ink">{s.title}</h3>
            <p className="mt-1 text-brand-muted">{s.body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <JoinButton />
      </div>
    </section>
  )
}
