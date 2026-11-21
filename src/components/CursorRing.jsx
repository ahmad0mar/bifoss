import { useEffect, useRef } from 'react'

/**
 * A small ring that trails the mouse, grows over links and buttons, and shrinks while pressed.
 *
 * - Fine pointers only (mouse, trackpad, pen). Touch screens never get it.
 * - The real cursor is left alone, so nothing is lost if this fails.
 * - Hidden over text fields, where the I-beam matters more.
 * - Reduced motion: the ring still follows, but with no lag.
 * Look: .cursor-ring in index.css.
 */

const CLICKABLE = 'a, button, summary, select, label, [role="button"], [role="tab"], [data-cursor="hover"]'
const FIELD = 'textarea, input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"])'

export default function CursorRing() {
  const ring = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined
    const el = ring.current
    const lag = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.22
    let x = 0
    let y = 0
    let tx = 0
    let ty = 0
    let raf = 0
    let placed = false

    const flag = (name, on) => {
      el.dataset[name] = on ? 'true' : 'false'
    }

    const tick = () => {
      x += (tx - x) * lag
      y += (ty - y) * lag
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? window.requestAnimationFrame(tick) : 0
    }

    const onMove = (e) => {
      if (e.pointerType === 'touch') return
      tx = e.clientX
      ty = e.clientY
      if (!placed) {
        x = tx
        y = ty
        placed = true
      }
      flag('visible', true)
      if (!raf) raf = window.requestAnimationFrame(tick)
    }
    const onOver = (e) => {
      const t = e.target instanceof Element ? e.target : null
      flag('hover', !!t?.closest(CLICKABLE))
      flag('field', !!t?.closest(FIELD))
    }
    const onDown = () => flag('down', true)
    const onUp = () => flag('down', false)
    const onLeave = () => flag('visible', false)

    const root = document.documentElement
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    root.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      root.removeEventListener('mouseleave', onLeave)
      window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={ring} className="cursor-ring" aria-hidden="true">
      <i />
    </div>
  )
}
