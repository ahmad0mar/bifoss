/**
 * Reads a design token (a CSS custom property from index.css) at runtime.
 * Canvas and WebGL code cannot use `var(--x)`, so it asks the document instead.
 * That keeps every colour defined once, in index.css.
 */
export function token(name) {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
