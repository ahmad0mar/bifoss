import { useEffect, useState } from 'react'

/**
 * Thin orange bar fixed below the navbar that shows how far the
 * user has scrolled through a long-read page (blog post, event detail).
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0)
      setVisible(scrollTop > 100)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className={`fixed left-0 top-0 z-[55] h-[3px] w-full transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      <div
        className="h-full bg-brand-orange-fill"
        style={{ width: `${progress}%`, transition: 'width 80ms linear' }}
      />
    </div>
  )
}
