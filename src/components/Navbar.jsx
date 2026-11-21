import { Link } from 'react-router-dom'
import { BookOpen, CalendarDays, GitBranch, House, Info, Users } from 'lucide-react'
import Logo from '@/components/Logo'
import LiquidTabBar from '@/components/LiquidTabBar'
import { site } from '@/data/site'

// Used by the footer too.
export const navLinks = [
  { to: '/about',    label: 'About' },
  { to: '/events',   label: 'Events' },
  { to: '/projects', label: 'Projects' },
  { to: '/blog',     label: 'Blog' },
  { to: '/team',     label: 'Team' },
]

// The tab bar: the pages above with Home in front, each with an icon.
const tabs = [
  { to: '/',         label: 'Home',     Icon: House },
  { to: '/about',    label: 'About',    Icon: Info },
  { to: '/events',   label: 'Events',   Icon: CalendarDays },
  { to: '/projects', label: 'Projects', Icon: GitBranch },
  { to: '/blog',     label: 'Blog',     Icon: BookOpen },
  { to: '/team',     label: 'Team',     Icon: Users },
]

export default function Navbar() {
  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 px-3"
      style={{ paddingTop: 'max(0.75rem, calc(0.75rem + env(safe-area-inset-top, 0px)))' }}
    >
      {/* Desktop: the row is as tall as the tab bar, so logo, bar and button all centre on one line. */}
      <div className="flex items-center md:h-[3.75rem]">
        <div className="pointer-events-auto flex min-h-[44px] items-center glass-chip px-4 md:min-h-[3rem]">
          <Logo className="h-6" />
        </div>
      </div>

      {/* Desktop: centred at the top. Phones: along the bottom, as on iOS. */}
      <div className="pointer-events-auto fixed bottom-0 left-1/2 mb-[max(0.75rem,env(safe-area-inset-bottom,0px))] -translate-x-1/2 md:absolute md:bottom-auto md:mb-0">
        <LiquidTabBar tabs={tabs} />
      </div>

      <Link to="/join" className="btn-brand pointer-events-auto !rounded-full !px-5 !text-sm md:!min-h-[3rem]">
        Join {site.name}
      </Link>
    </header>
  )
}
