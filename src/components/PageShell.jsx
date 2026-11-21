import { usePageTitle } from '@/hooks/usePageTitle'
import AnimatedPage from '@/components/AnimatedPage'

/**
 * Every inner page: title, one intro sentence, content. Left aligned.
 * `description` feeds the page's meta description; it defaults to `intro` when that is text.
 */
export default function PageShell({ title, intro, description, children, titleTag }) {
  usePageTitle(titleTag ?? title, description ?? (typeof intro === 'string' ? intro : undefined))
  return (
    <AnimatedPage>
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-24 sm:pt-36">
        <h1 className="headline text-3xl sm:text-4xl md:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-brand-muted">{intro}</p>}
        <div className="mt-10">{children}</div>
      </section>
    </AnimatedPage>
  )
}
