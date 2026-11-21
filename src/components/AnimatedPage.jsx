/**
 * Page entrance: a 150 ms opacity fade, no movement (see .page-fade in index.css).
 * Reduced motion is handled globally in index.css.
 */
export default function AnimatedPage({ children }) {
  return <div className="page-fade">{children}</div>
}
