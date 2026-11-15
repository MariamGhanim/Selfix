import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const AUTH_NAV = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function AuthTopNav() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Explore Selfix Life"
      className="absolute left-0 right-0 top-0 z-30 flex items-center justify-end gap-1 px-3 py-2.5 sm:px-5 sm:py-3 lg:px-7"
    >
      <div className="inline-flex items-center gap-0.5 rounded-full bg-[var(--surface)]/85 p-1 shadow-md ring-1 ring-[var(--page-edge)]/55 backdrop-blur-md">
        {AUTH_NAV.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-full px-3 py-1.5 font-display text-[11px] font-semibold transition sm:px-3.5 sm:text-xs ${
                active
                  ? 'bg-[var(--accent-deep)] text-white shadow-sm'
                  : 'text-[var(--ink-soft)] hover:bg-[var(--accent-glow)] hover:text-[var(--ink)]'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

function CozyJournalArt() {
  return (
    <svg
      viewBox="0 0 420 360"
      className="auth-brand-art mx-auto h-auto w-full max-w-[22rem]"
      aria-hidden
    >
      <defs>
        <linearGradient id="authBookCover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-soft)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
        <linearGradient id="authPageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--surface-strong)" />
          <stop offset="100%" stopColor="var(--paper)" />
        </linearGradient>
      </defs>

      <ellipse cx="210" cy="318" rx="118" ry="18" fill="var(--accent)" opacity="0.18" />

      <g className="auth-float-slow">
        <rect
          x="118"
          y="78"
          width="168"
          height="214"
          rx="18"
          fill="url(#authBookCover)"
          stroke="var(--page-edge)"
          strokeWidth="2"
        />
        <rect x="132" y="78" width="10" height="214" fill="var(--spine)" opacity="0.55" />
        <rect
          x="148"
          y="92"
          width="122"
          height="186"
          rx="10"
          fill="url(#authPageGrad)"
          stroke="var(--page-edge)"
          strokeWidth="1.5"
        />
        <path
          d="M162 128h94M162 152h78M162 176h88M162 200h64"
          stroke="var(--accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        <circle cx="248" cy="236" r="10" fill="var(--gold)" opacity="0.7" />
        <circle cx="228" cy="248" r="7" fill="var(--accent-deep)" opacity="0.55" />
      </g>

      <g className="auth-float">
        <rect
          x="286"
          y="118"
          width="54"
          height="54"
          rx="14"
          fill="var(--gold-soft)"
          stroke="var(--gold)"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <path
          d="M300 145h26M300 155h18"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      <g className="auth-float-delayed">
        <circle
          cx="96"
          cy="168"
          r="28"
          fill="var(--accent-glow)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <path
          d="M86 168c4-10 16-10 20 0c-4 10-16 10-20 0z"
          fill="var(--accent)"
          opacity="0.55"
        />
      </g>
    </svg>
  )
}

function AuthBrandPanel() {
  return (
    <section className="auth-brand-panel relative flex min-h-0 flex-col justify-between overflow-hidden px-5 py-6 sm:min-h-[200px] sm:px-10 sm:py-10 lg:min-h-0 lg:px-12 lg:py-14">
      <div className="auth-brand-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="auth-brand-orb auth-brand-orb-a pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full" />
      <div className="auth-brand-orb auth-brand-orb-b pointer-events-none absolute -right-8 bottom-16 h-48 w-48 rounded-full" />

      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent-deep)]/80"
        >
          Selfix Life
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2 max-w-md font-display text-[1.45rem] font-semibold leading-tight tracking-tight text-[var(--ink)] sm:mt-3 sm:text-[2.15rem]"
        >
          A soft space for your day, thoughts, and habits
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-sm font-display text-[13px] leading-relaxed text-[var(--ink-soft)] sm:mt-4 sm:text-[14px]"
        >
          Paint your year in gentle pixels. Keep little notes beside each habit. Return to a journal
          that feels calm, private, and yours.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-4 hidden max-h-[200px] sm:mt-6 sm:block lg:mt-0 lg:max-h-none"
      >
        <CozyJournalArt />
      </motion.div>

      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="relative z-10 mt-4 flex flex-wrap gap-2 sm:mt-6 lg:mt-8"
      >
        {['Year in pixels', 'Private notes', 'Soft insights'].map((item) => (
          <li
            key={item}
            className="rounded-full bg-[var(--surface)]/70 px-3 py-1.5 font-display text-[11px] font-semibold text-[var(--ink-soft)] shadow-sm ring-1 ring-[var(--page-edge)]/50 backdrop-blur-sm"
          >
            {item}
          </li>
        ))}
      </motion.ul>
    </section>
  )
}

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-split-shell relative flex min-h-[100dvh] h-[100dvh] w-full max-w-full items-stretch justify-center overflow-x-hidden overflow-y-auto p-0 sm:items-center sm:p-5 lg:p-7">
      <AuthTopNav />
      <div className="auth-split-frame book-shadow paper-texture relative mt-11 grid min-h-0 h-auto max-h-none w-full max-w-6xl overflow-y-auto rounded-none border-0 border-[var(--page-edge)] sm:mt-0 sm:h-full sm:max-h-[min(920px,100%)] sm:overflow-y-auto sm:rounded-[28px] sm:border lg:grid-cols-12 lg:rounded-[32px]">
        <div className="min-h-0 lg:col-span-5">
          <AuthBrandPanel />
        </div>

        <div className="relative flex min-h-0 flex-1 items-start justify-center overflow-y-auto border-t border-[var(--page-edge)]/60 bg-[var(--surface)]/55 px-3 py-5 backdrop-blur-md sm:items-center sm:px-8 sm:py-8 lg:col-span-7 lg:border-l lg:border-t-0">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at 80% 0%, var(--accent-glow), transparent 55%), radial-gradient(ellipse at 10% 100%, var(--paper-deep), transparent 50%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="auth-form-card relative w-full max-w-md rounded-[1.6rem] border border-[var(--page-edge)]/70 bg-[var(--surface)] px-5 py-6 shadow-[var(--panel-shadow)] sm:px-7 sm:py-7"
          >
            <div className="mb-6 text-center">
              <p className="font-display text-2xl font-semibold tracking-tight text-[var(--accent-deep)] sm:text-3xl">
                Selfix Life
              </p>
              <h1 className="mt-2 font-display text-xl font-semibold text-[var(--ink)]">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm leading-relaxed text-[var(--ink-soft)]">{subtitle}</p>
              ) : null}
            </div>
            {children}
            {footer ? (
              <div className="mt-5 text-center text-sm text-[var(--ink-soft)]">{footer}</div>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function AuthInput({ label, error, className = '', ...props }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[var(--ink-soft)]">
        {label}
      </span>
      <input
        {...props}
        className={`w-full rounded-2xl border border-[var(--page-edge)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-soft)]/70 focus:ring-2 focus:ring-[var(--accent)] ${className}`}
      />
      {error && <span className="mt-1 block text-xs font-semibold text-[#b8385c]">{error}</span>}
    </label>
  )
}

export function AuthButton({
  children,
  loading,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) {
  const styles =
    variant === 'primary'
      ? 'bg-[var(--accent-deep)] text-white shadow-md hover:brightness-105'
      : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--page-edge)] hover:bg-[var(--surface-strong)]'

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
      {...props}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}

export function AuthLinkButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-bold text-[var(--accent-deep)] underline-offset-2 hover:underline"
    >
      {children}
    </button>
  )
}

export function AuthAlert({ tone = 'error', children }) {
  const bg =
    tone === 'success'
      ? 'bg-[#e8f5e9] text-[#2e7d4f]'
      : 'bg-[#fde8ee] text-[#b8385c]'
  return (
    <div className={`mb-3 rounded-2xl px-3 py-2 text-xs font-semibold ${bg}`}>{children}</div>
  )
}
