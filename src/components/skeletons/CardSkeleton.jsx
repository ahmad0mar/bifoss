/**
 * Reusable skeleton card — matches the visual footprint of a real card.
 * The placeholder fade is defined globally in index.css (.skeleton).
 */
export default function CardSkeleton({ hasImage = true, lines = 2 }) {
  return (
    <li className="overflow-hidden rounded-lg border border-brand-rule bg-brand-paper">
      {hasImage && <div className="skeleton h-36 w-full" />}
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-20 rounded-lg" />
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton h-3 rounded ${i === lines - 1 ? 'w-1/2' : 'w-full'}`}
          />
        ))}
      </div>
    </li>
  )
}
