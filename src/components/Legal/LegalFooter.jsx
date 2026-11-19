import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/contact', label: 'Contact' },
]

export default function LegalFooter({ alwaysShow = false }) {
  const { pathname } = useLocation()

  return (
    <footer
      className={`legal-footer mt-1 shrink-0 flex-wrap items-center justify-center gap-x-2.5 gap-y-1 px-2 pb-0.5 text-[10px] text-[var(--footer-ink)] sm:mt-1.5 ${
        alwaysShow ? 'flex' : 'hidden sm:flex'
      }`}
    >
      {LINKS.map((link, i) => {
        const active =
          pathname === link.to ||
          (link.to !== '/' && pathname.startsWith(`${link.to}/`))
        return (
          <Fragment key={link.to}>
            {i > 0 && <span className="opacity-35" aria-hidden>·</span>}
            <Link
              to={link.to}
              className={`font-semibold transition hover:text-[var(--accent-deep)] hover:underline hover:underline-offset-2 ${
                active ? 'text-[var(--accent-deep)] underline underline-offset-2' : ''
              }`}
            >
              {link.label}
            </Link>
          </Fragment>
        )
      })}
    </footer>
  )
}
