import { Link } from 'react-router-dom'
import { site } from '@/data/site'
import ScrollReveal from '@/components/ScrollReveal'

export default function ClosingCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-10">
      <div className="rounded-lg bg-brand-wash px-6 py-10 sm:px-12 sm:py-14">
        <ScrollReveal as="h2" className="headline max-w-3xl text-2xl sm:text-3xl md:text-4xl">
          Your first pull request starts here
        </ScrollReveal>
        <div className="mt-8">
          <Link to="/join" className="btn-brand">Join {site.name}</Link>
        </div>
      </div>
    </section>
  )
}
