import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react'

/**
 * Words appear one after another as the text scrolls up the screen.
 *
 * - Pass plain text as children. `as` picks the tag (p, h2, ...). The classes you give stay on it.
 * - One scroll listener serves every instance. Each frame it writes a single CSS variable (--p,
 *   0 to 1) on each element; the per-word opacity is worked out in CSS (.reveal-word in index.css).
 * - Reduced motion gets plain text. Screen readers get the whole sentence from a hidden copy,
 *   so they never hear it word by word.
 */

const live = new Set()
let frame = 0
let observer = null

const atPageEnd = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

function measure(el, atEnd) {
  const vh = window.innerHeight
  const { top, height } = el.getBoundingClientRect()
  // 0 when the top edge is at 90% of the screen height, 1 when the bottom edge is at 65%
  const p = atEnd ? 1 : (vh * 0.9 - top) / (vh * 0.25 + height)
  el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3))
}

function update() {
  frame = 0
  const atEnd = atPageEnd()
  live.forEach((el) => measure(el, atEnd))
}

function schedule() {
  if (!frame) frame = window.requestAnimationFrame(update)
}

function watch(el) {
  live.add(el)
  if (live.size === 1) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(schedule) // images and fonts moving the text
      observer.observe(document.body)
    }
  }
  measure(el, atPageEnd())
}

function unwatch(el) {
  live.delete(el)
  if (live.size === 0) {
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
    observer?.disconnect()
    observer = null
    window.cancelAnimationFrame(frame)
    frame = 0
  }
}

const canAnimate = () =>
  typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function ScrollReveal({ as: Tag = 'p', className, children }) {
  const ref = useRef(null)
  const [animate] = useState(canAnimate)
  const text = typeof children === 'string' ? children : null
  const words = useMemo(() => (text ? text.split(/\s+/).filter(Boolean) : []), [text])
  const active = animate && words.length > 0

  useLayoutEffect(() => {
    if (!active) return undefined
    const el = ref.current
    watch(el)
    return () => unwatch(el)
  }, [active])

  if (!active) return <Tag className={className}>{children}</Tag>

  return (
    <Tag ref={ref} className={className} style={{ '--n': words.length }}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="reveal-word" style={{ '--i': i }}>{w}</span>{' '}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
