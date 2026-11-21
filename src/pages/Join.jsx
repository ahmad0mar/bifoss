import { Link } from 'react-router-dom'
import PageShell from '@/components/PageShell'
import JoinButton from '@/components/JoinButton'
import { site } from '@/data/site'

export default function Join() {
  return (
    <PageShell
      title={`Join ${site.name}`}
      intro="Membership is a short form and a first session. No experience needed."
    >
      <div className="flex flex-wrap items-center gap-3">
        <JoinButton fallback="notice" />
        <Link to="/events" className="btn-ghost">See events</Link>
      </div>

      <p className="mt-12 max-w-[var(--measure)] text-brand-muted">
        <Link className="text-link" to="/#how-to-join">See the five steps</Link>
        {' '}from form to first project, and{' '}
        <Link className="text-link" to="/#faq">read the common questions</Link>
        , on the home page.
      </p>

      <section className="mt-12 max-w-xl border-t border-brand-rule pt-6">
        <h2 className="text-lg font-semibold text-brand-ink">{site.email ? 'Need help or have a question?' : 'Code of conduct'}</h2>
        <p className="mt-2 text-brand-muted">
          {site.email && (
            <>
              Email{' '}
              <a className="text-link" href={`mailto:${site.email}`}>{site.email}</a>
              .{' '}
            </>
          )}
          Members are expected to follow the <Link className="text-link" to="/code-of-conduct">code of conduct</Link>.
        </p>
      </section>
    </PageShell>
  )
}
