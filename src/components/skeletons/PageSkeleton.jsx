import CardSkeleton from './CardSkeleton'

/**
 * Full-page skeleton that mirrors the PageShell + card-grid layout.
 */
export default function PageSkeleton({
  cards = 3,
  hasImage = true,
  cols = 'sm:grid-cols-2 lg:grid-cols-3',
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-8 pt-36" aria-busy="true" aria-label="Loading">
      <div className="skeleton mb-5 h-6 w-24 rounded-lg" />
      <div className="skeleton mb-4 h-14 w-2/3 rounded-lg" />
      <div className="skeleton mb-10 h-5 w-1/2 rounded-lg" />
      <ul className={`grid gap-4 ${cols}`}>
        {Array.from({ length: cards }).map((_, i) => (
          <CardSkeleton key={i} hasImage={hasImage} />
        ))}
      </ul>
    </section>
  )
}
