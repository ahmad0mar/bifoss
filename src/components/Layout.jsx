import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import RouteBoundary from '@/components/RouteBoundary'
import ScrollToTopButton from '@/components/ScrollToTopButton'
import CursorRing from '@/components/CursorRing'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-screen flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-brand-orange-fill focus:px-4 focus:py-2 focus:text-brand-ink"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <RouteBoundary key={pathname}>
          <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </RouteBoundary>
      </main>
      <Footer />
      <ScrollToTopButton />
      <CursorRing />
    </div>
  )
}
