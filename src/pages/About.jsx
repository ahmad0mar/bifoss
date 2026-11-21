import { Link } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import Todo, { showTodos } from '@/components/Todo'
import { TrackList } from '@/components/home/Tracks'
import { site } from '@/data/site'
import ScrollReveal from '@/components/ScrollReveal'

const values = [
  { title: 'Learn by building', body: 'Sessions end with something running on your laptop, not just slides.' },
  { title: 'Open by default', body: 'Our code, notes and event material are shared publicly so anyone can reuse and improve them.' },
  { title: 'Beginners are the point', body: 'Nobody is expected to know it all. Questions are welcome and mentors help you start small.' },
]

export default function About() {
  return (
    <PageShell
      title={`About ${site.name}`}
      intro={`${site.name} (${site.tagline}) is a student-run free and open source society in Mangaluru, India. We help students learn, build and contribute to open source together.`}
    >
      <div className="prose-bifoss text-brand-muted">
        <ScrollReveal>Free and open source software runs most of the internet, and anyone can take part in it. Our job is to make the first step easier for students: set up the tools, read real code, and send a first contribution.</ScrollReveal>
        {showTodos && (
          <p><Todo>add the founding year, the faculty advisor and one or two lines on how the club started</Todo></p>
        )}
      </div>

      <ScrollReveal as="h2" className="headline mt-16 text-2xl sm:text-3xl md:text-4xl">What we stand for</ScrollReveal>
      <ul className="mt-8 max-w-[var(--measure)] space-y-6">
        {values.map((v) => (
          <li key={v.title}>
            <h3 className="text-lg font-semibold text-brand-ink">{v.title}</h3>
            <p className="mt-1 text-brand-muted">{v.body}</p>
          </li>
        ))}
      </ul>

      <ScrollReveal as="h2" className="headline mt-16 text-2xl sm:text-3xl md:text-4xl">What you can work on</ScrollReveal>
      <div className="mt-8">
        <TrackList />
      </div>

      <p className="mt-16 max-w-[var(--measure)] text-brand-muted">
        Questions about joining? <Link className="text-link" to="/#faq">Read the FAQ</Link>.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/join" className="btn-brand">Join {site.name}</Link>
        <Link to="/events" className="btn-ghost">See events</Link>
        <Link to="/code-of-conduct" className="btn-ghost">Code of conduct</Link>
      </div>
    </PageShell>
  )
}
