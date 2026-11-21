import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * Floating orange button that scrolls the user back to the top.
 * Appears after scrolling 420 px. No entrance animation.
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 420)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] right-4 z-50 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-orange-fill text-brand-ink transition-colors hover:bg-brand-ink hover:text-brand-orange-fill md:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] md:right-8"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
