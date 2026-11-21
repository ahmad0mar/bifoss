import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { createLiquidTabs } from '@/lib/liquidTabs'
import { token } from '@/lib/tokens'

// Which tab a path belongs to: '/' is Home, '/events/some-slug' is Events.
// Pages that are not in the bar (Join, Code of conduct, 404) open none.
function tabFor(pathname, tabs) {
  const k = tabs.findIndex((t) => (t.to === '/' ? pathname === '/' : pathname === t.to || pathname.startsWith(`${t.to}/`)))
  return k
}

export default function LiquidTabBar({ tabs, className = '' }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const els = useRef({})
  const api = useRef(null)
  const latest = useRef({ pathname, navigate, tabs })
  latest.current = { pathname, navigate, tabs }

  useEffect(() => {
    const { bar, skin, drop, pill, row, canvas, ink } = els.current
    const engine = createLiquidTabs({
      bar,
      skin,
      drop,
      pill,
      row,
      canvas,
      ink,
      tint: token('--orange-ink'), // same token as `.lg-face.lit` in index.css
      initial: tabFor(latest.current.pathname, latest.current.tabs),
      onSelect: (k) => {
        const { pathname: here, navigate: go, tabs: list } = latest.current
        if (tabFor(here, list) !== k) go(list[k].to)
      },
    })
    api.current = engine
    return () => {
      engine.destroy()
      api.current = null
    }
  }, [])

  // the router decides which tab is open
  useEffect(() => {
    api.current?.setOpen(tabFor(pathname, tabs))
  }, [pathname, tabs])

  const set = (name) => (el) => {
    if (el) els.current[name] = el
  }

  return (
    <nav aria-label="Main" ref={set('bar')} className={`lg-bar ${className}`}>
      <span ref={set('ink')} className="lg-ink" aria-hidden="true" />
      <div ref={set('skin')} className="lg-skin" />
      <div ref={set('drop')} className="lg-drop" aria-hidden="true">
        <div ref={set('pill')} className="lg-pill" />
      </div>
      <div ref={set('row')} className="lg-row">
        {tabs.map((t, k) => (
          <a
            key={t.to}
            href={t.to}
            draggable={false}
            onClick={(e) => {
              if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return
              e.preventDefault()
              // a pointer's tap or drag is handled by the bar; a key press (detail 0)
              // and a click with no tab open come here
              const engine = api.current
              if (!engine) return navigate(t.to)
              if (e.detail === 0 || engine.getOpen() < 0) engine.select(k)
            }}
          >
            <span className="lg-face">
              <t.Icon width={24} height={24} strokeWidth={1.9} aria-hidden="true" />
              <span>{t.label}</span>
            </span>
          </a>
        ))}
      </div>
      <canvas ref={set('canvas')} className="lg-lens" aria-hidden="true" />
    </nav>
  )
}
