// Visible marker for content the club still has to supply.
// Shown only while developing (`npm run dev`). In a production build these
// render nothing, so a missed TODO never reaches a visitor.
// Use `showTodos` to also hide the surrounding element (paragraph, row) in production.
export const showTodos = !import.meta.env.PROD

export default function Todo({ children }) {
  if (!showTodos) return null
  return <span className="todo-flag">TODO: {children}</span>
}

// Renders text, turning a leading or embedded "TODO: ..." into a dev-only TODO flag.
// In production the TODO part is dropped and any text before it is kept.
export function TodoText({ children }) {
  const s = String(children ?? '')
  const i = s.indexOf('TODO:')
  if (i === -1) return s
  return (
    <>
      {s.slice(0, i)}
      <Todo>{s.slice(i + 5).trim()}</Todo>
    </>
  )
}
