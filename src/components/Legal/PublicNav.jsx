import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function PublicNav({
  homeLabel = 'Sign in',
  homeTo = '/',
  className = '',
}) {
  const { pathname } = useLocation()

  return (
    <header
      className={`relative z-20 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 ${className}`}
    >
      <Link
        to="/"
        className="rounded-full bg-[var(--surface)]/90 px-3.5 py-1.5 text-xs font-bold shadow-md backdrop-blur transition hover:bg-[var(--surface-strong)]"
      >
        <span className="font-display text-[var(--accent-deep)]">Selfix Life</span>
      </Link>

      <nav
        aria-label="Main"
        className="flex flex-wrap items-center justify-end gap-0.5 sm:gap-1"
      >
        {NAV.map((item) => {
          const active =
            pathname === item.to ||
            (item.to !== '/' && pathname.startsWith(`${item.to}/`))
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`inline-flex min-h-9 items-center rounded-full px-2.5 text-[12px] font-semibold tracking-wide transition sm:px-3 sm:text-[13px] ${
                active
                  ? 'bg-[var(--accent-glow)] text-[var(--accent-deep)]'
                  : 'text-[var(--ink-soft)] hover:bg-[var(--surface)]/90 hover:text-[var(--ink)]'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
        <Link
          to={homeTo}
          className="ml-1 inline-flex min-h-9 items-center rounded-full border border-[var(--page-edge)] bg-[var(--surface)]/90 px-3 text-[12px] font-bold text-[var(--ink-soft)] shadow-sm backdrop-blur transition hover:bg-[var(--surface-strong)] hover:text-[var(--ink)] sm:text-[13px]"
        >
          {homeLabel}
        </Link>
      </nav>
    </header>
  )
}
