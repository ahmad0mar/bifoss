import { useEffect, useState } from 'react'

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState('up')
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY
          const diff = currentY - lastY
          setScrollY(currentY)
          if (Math.abs(diff) > 4) {
            setScrollDir(diff > 0 ? 'down' : 'up')
            lastY = currentY
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return { scrollDir, scrollY }
}
