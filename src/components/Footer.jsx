import { Link } from 'react-router-dom'
import Logo from '@/components/Logo'
import { site } from '@/data/site'
import { navLinks } from '@/components/Navbar'

export default function Footer() {
  const socials = site.social.filter((s) => s.url)
  return (
    <footer className="mt-24 border-t border-brand-rule bg-brand-wash">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        {/* Col 1 — Brand */}
        <div className="space-y-3">
          <Logo className="h-9" />
          <p className="text-sm text-brand-muted">{site.tagline}</p>
          {site.address && <p className="text-sm text-brand-muted">{site.address}</p>}
        </div>

        {/* Col 2 — Navigation */}
        <nav aria-label="Footer">
          <h2 className="mb-3 text-sm font-semibold text-brand-ink">Explore</h2>
          <ul className="text-sm text-brand-muted">
            {[
              ...navLinks,
              { to: '/join', label: `Join ${site.name}` },
              { to: '/code-of-conduct', label: 'Code of conduct' },
            ].map((l) => (
              <li key={l.to}>
                <Link className="link-animated inline-flex min-h-[44px] min-w-[44px] items-center transition-colors hover:text-brand-orange-ink" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Col 3 — Contact */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-brand-ink">Contact</h2>
          {site.email && (
            <p className="text-sm text-brand-muted">
              <a className="link-animated inline-flex min-h-[44px] min-w-[44px] items-center transition-colors hover:text-brand-orange-ink" href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
          {!site.email && socials.length === 0 && (
            <p className="text-sm text-brand-muted">Contact details will be listed here soon.</p>
          )}
          {socials.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    className="btn-ghost !px-3.5 !text-xs"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-brand-rule">
        <p className="mx-auto max-w-6xl px-6 py-4 text-xs text-brand-muted">
          © {new Date().getFullYear()} {site.name}. Free and open source, made by students.
        </p>
      </div>
    </footer>
  )
}
