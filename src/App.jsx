import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from '@/components/Layout'

const Home          = lazy(() => import('@/pages/Home'))
const About         = lazy(() => import('@/pages/About'))
const Join          = lazy(() => import('@/pages/Join'))
const Events        = lazy(() => import('@/pages/Events'))
const EventDetail   = lazy(() => import('@/pages/EventDetail'))
const Blog          = lazy(() => import('@/pages/Blog'))
const BlogDetail    = lazy(() => import('@/pages/BlogDetail'))
const Team          = lazy(() => import('@/pages/Team'))
const Projects      = lazy(() => import('@/pages/Projects'))
const CodeOfConduct = lazy(() => import('@/pages/CodeOfConduct'))
const NotFound      = lazy(() => import('@/pages/NotFound'))

function AppRoutes() {
  return (
    <Routes>
        <Route element={<Layout />}>
          <Route path="/"                  element={<Home />} />
          <Route path="/about"             element={<About />} />
          <Route path="/join"              element={<Join />} />
          <Route path="/events"            element={<Events />} />
          <Route path="/events/:slug"      element={<EventDetail />} />
          <Route path="/blog"              element={<Blog />} />
          <Route path="/blog/:slug"        element={<BlogDetail />} />
          <Route path="/team"              element={<Team />} />
          <Route path="/projects"          element={<Projects />} />
          <Route path="/code-of-conduct"   element={<CodeOfConduct />} />
          <Route path="*"                  element={<NotFound />} />
        </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
