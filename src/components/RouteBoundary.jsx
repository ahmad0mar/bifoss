import { Component } from 'react'

// Catches a failed page-chunk load (for example after a new deploy) so the visitor sees
// a message and a reload button instead of a blank page.
export default class RouteBoundary extends Component {
  state = { failed: false, error: null }

  static getDerivedStateFromError(error) {
    return { failed: true, error }
  }

  componentDidCatch(error, info) {
    // Log to console so we can debug
    console.error('[RouteBoundary] Caught render error:', error)
    console.error('[RouteBoundary] Component stack:', info?.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <section className="mx-auto max-w-5xl px-6 pb-8 pt-24 sm:pt-36">
        <h1 className="headline text-3xl sm:text-4xl md:text-5xl">This page did not load</h1>
        <p className="mt-5 max-w-2xl text-lg text-brand-muted">
          Check your connection, then reload the page. If it keeps happening, the site may have just
          been updated.
        </p>
        {/* Show error details in development */}
        {import.meta.env.DEV && this.state.error && (
          <pre className="mt-4 max-w-full overflow-auto rounded-lg bg-brand-wash p-4 text-left text-xs text-brand-ink">
            {String(this.state.error)}
          </pre>
        )}
        <button type="button" className="btn-brand mt-8" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </section>
    )
  }
}
