import { tools } from '@/data/home'

// A plain sentence, not a scrolling strip: it wraps, it can be read and selected.
const list = `${tools.slice(0, -1).join(', ')}, and ${tools[tools.length - 1]}`

export default function ToolsLine() {
  return (
    <section aria-label="Tools and technologies we use" className="border-y border-brand-rule">
      <p className="mx-auto max-w-6xl px-6 py-6 text-brand-muted">
        <span className="font-semibold text-brand-ink">We work with </span>
        {list}.
      </p>
    </section>
  )
}
