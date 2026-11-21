import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { site } from '@/data/site'
import { faqs } from '@/data/home'
import TerminalHero from '@/components/home/TerminalHero'
import ToolsLine from '@/components/home/ToolsLine'
import Tracks from '@/components/home/Tracks'
import UpcomingStrip from '@/components/home/UpcomingStrip'
import HowToJoin from '@/components/home/HowToJoin'
import ClosingCTA from '@/components/home/ClosingCTA'
import FAQ from '@/components/FAQ'
import ScrollReveal from '@/components/ScrollReveal'

export default function Home() {
  usePageTitle()

  return (
    <div>
      {/* Hero: one headline, one sentence, two buttons, and the terminal. */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-12 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14 lg:pb-24">
        <div>
          <h1 className="headline" style={{ fontSize: 'clamp(2.5rem, 1.6rem + 3.6vw, 4.25rem)', lineHeight: 1.05 }}>
            Build in the open, together.
          </h1>
          <p className="mt-6 max-w-[34rem] text-lg text-brand-muted">
            {site.name} is a new student-run club in Mangaluru for learning, building and
            contributing to free and open source software.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/join" className="btn-brand">Join {site.name}</Link>
            <Link to="/events" className="btn-ghost">See events</Link>
          </div>
        </div>
        <TerminalHero />
      </section>

      <ToolsLine />
      <Tracks />
      <UpcomingStrip />
      <HowToJoin />

      <section id="faq" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20">
        <ScrollReveal as="h2" className="headline text-2xl sm:text-3xl md:text-4xl">Questions, answered</ScrollReveal>
        <div className="mt-8 max-w-3xl">
          <FAQ items={faqs} />
        </div>
      </section>

      <ClosingCTA />
    </div>
  )
}
