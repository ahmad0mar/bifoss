import { useCallback, useEffect, useRef, useState } from 'react'
import { heroSteps } from '@/data/home'

/**
 * The home page terminal: a first contribution in four commands.
 *
 * - Plays once on load (about six seconds): commands type out, notes and output
 *   lines appear at once. Then it stays still. No loop, no blinking cursor.
 * - "Replay" runs it again. It only exists where the animation does.
 * - Reduced motion and small screens (under 640px) get the finished panel at once.
 * - The animated panel is aria-hidden. Screen readers get the finished text in one
 *   piece from a visually hidden copy, so they never hear letters arrive.
 * - The "$" prompt is not selectable, so copying the panel gives the commands only.
 *
 * Wording lives in `heroSteps` in src/data/home.js.
 */

const TYPE_MS = 42 // per character
const AFTER_COMMAND_MS = 380 // pause once a command is typed
const AFTER_NOTE_MS = 140 // pause after a note line appears
const START_DELAY_MS = 500

const lines = heroSteps.flatMap((s) => [
  { kind: 'cmd', text: s.cmd },
  ...(s.note ? [{ kind: 'note', text: `# ${s.note}` }] : []),
  ...(s.output ? [{ kind: 'out', text: s.output }] : []),
])
const plainText = lines.map((l) => l.text).join('\n')

function canAnimate() {
  if (typeof window === 'undefined') return false
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    window.matchMedia('(min-width: 640px)').matches
  )
}

export default function TerminalHero() {
  const [animated] = useState(canAnimate)
  const [status, setStatus] = useState(animated ? 'running' : 'done')
  const [pos, setPos] = useState({ line: 0, chars: 0 })
  const timer = useRef(0)

  const play = useCallback(() => {
    window.clearTimeout(timer.current)
    setStatus('running')
    setPos({ line: 0, chars: 0 })
    let li = 0
    let ch = 0

    const step = () => {
      const line = lines[li]
      if (!line) {
        setStatus('done')
        return
      }
      if (line.kind === 'cmd') {
        ch += 1
        setPos({ line: li, chars: ch })
        if (ch >= line.text.length) {
          li += 1
          ch = 0
          timer.current = window.setTimeout(step, AFTER_COMMAND_MS)
        } else {
          timer.current = window.setTimeout(step, TYPE_MS)
        }
        return
      }
      // Notes and output appear at once.
      li += 1
      setPos({ line: li, chars: 0 })
      timer.current = window.setTimeout(step, line.kind === 'out' ? 0 : AFTER_NOTE_MS)
    }

    timer.current = window.setTimeout(step, START_DELAY_MS)
  }, [])

  useEffect(() => {
    if (animated) play()
    return () => window.clearTimeout(timer.current)
  }, [animated, play])

  const done = status === 'done'

  return (
    <div role="group" aria-label="Example: the commands for a first contribution" className="terminal">
      <div className="terminal-bar">
        <span className="terminal-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className="terminal-title">first-contribution</span>
        <span className="terminal-bar-end">
          <span>example</span>
          {animated && (
            <button
              type="button"
              onClick={play}
              disabled={!done}
              className={`terminal-replay${done ? '' : ' invisible'}`}
            >
              Replay
            </button>
          )}
        </span>
      </div>

      <div className="terminal-body" aria-hidden="true">
        {lines.map((line, i) => {
          const reached = done || i < pos.line || (i === pos.line && line.kind === 'cmd')
          const text = done || i < pos.line ? line.text : i === pos.line && line.kind === 'cmd' ? line.text.slice(0, pos.chars) : ''
          const caret = !done && i === pos.line && line.kind === 'cmd'
          return (
            <div key={i} className={`terminal-line${line.kind === 'note' ? ' terminal-note' : ''}`}>
              {line.kind === 'cmd' && reached && <span className="terminal-prompt">$</span>}
              {text}
              {caret && <span className="terminal-caret" />}
            </div>
          )
        })}
      </div>

      <pre className="sr-only">{plainText}</pre>
    </div>
  )
}
