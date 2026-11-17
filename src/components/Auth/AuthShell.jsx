import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const AUTH_NAV = [
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function AuthTopNav() {
  const { pathname } = useLocation()

  return (
    <header className="auth-site-header relative z-20 flex items-center justify-between gap-3 border-b border-[var(--page-edge)]/45 px-4 py-2 pt-[max(0.35rem,env(safe-area-inset-top))] sm:px-6 sm:py-3.5 sm:pt-[max(0.75rem,env(safe-area-inset-top))] lg:px-8">
      <Link
        to="/"
        className="font-display text-[14px] font-semibold tracking-tight text-[var(--accent-deep)] transition hover:text-[var(--ink)] sm:text-base"
      >
        Selfix Life
      </Link>
      <nav aria-label="Explore Selfix Life" className="flex items-center gap-0.5 sm:gap-1">
        {AUTH_NAV.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`inline-flex min-h-9 items-center rounded-lg px-2.5 text-[12.5px] font-medium tracking-wide transition sm:min-h-9 sm:px-3.5 sm:text-[13px] ${
                active
                  ? 'text-[var(--accent-deep)]'
                  : 'text-[var(--ink-soft)] hover:bg-[var(--accent-glow)]/70 hover:text-[var(--ink)]'
              }`}
            >
              {item.label}
              {active ? (
                <span
                  className="ml-1.5 h-1 w-1 rounded-full bg-[var(--accent-deep)]"
                  aria-hidden
                />
              ) : null}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

function CozyJournalArt() {
  return (
    <svg
      viewBox="0 0 420 360"
      className="auth-brand-art mx-auto h-auto w-full max-w-[18rem] lg:max-w-[20rem]"
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

      <ellipse cx="210" cy="318" rx="118" ry="18" fill="var(--accent)" opacity="0.14" />

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
          opacity="0.4"
        />
        <circle cx="248" cy="236" r="10" fill="var(--gold)" opacity="0.65" />
        <circle cx="228" cy="248" r="7" fill="var(--accent-deep)" opacity="0.5" />
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
          opacity="0.88"
        />
        <path
          d="M300 145h26M300 155h18"
          stroke="var(--gold)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.65"
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
          opacity="0.5"
        />
      </g>
    </svg>
  )
}

function AuthBrandPanel() {
  return (
    <section className="auth-brand-panel relative flex min-h-0 flex-col justify-start overflow-hidden px-4 py-0 sm:justify-between sm:px-8 sm:py-8 lg:px-10 lg:py-12 lg:h-full">
      <div className="auth-brand-glow pointer-events-none absolute inset-0 max-sm:opacity-45" aria-hidden />
      <div className="auth-brand-orb auth-brand-orb-a pointer-events-none absolute -left-10 top-8 h-40 w-40 rounded-full max-sm:hidden" />
      <div className="auth-brand-orb auth-brand-orb-b pointer-events-none absolute -right-8 bottom-16 h-48 w-48 rounded-full max-sm:hidden" />

      <div className="auth-hero-copy relative z-10 mx-auto w-full sm:mx-0">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent-deep)]/80 sm:text-[11px] sm:tracking-[0.16em]"
        >
          Year in pixels journal
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          className="auth-hero-heading mt-3 font-display text-[1.7rem] font-semibold leading-[1.2] tracking-tight text-[var(--ink)] sm:mt-3 sm:max-w-sm sm:text-[1.85rem] sm:leading-[1.25] lg:text-[2rem]"
        >
          A calm place for the days
          <br className="sm:hidden" />
          that make your year
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-2.5 hidden max-w-sm text-[13px] leading-relaxed text-[var(--ink-soft)] sm:mt-3 sm:block sm:text-[14px]"
        >
          Soft color for habits. Quiet notes beside each day. Private sync when you are ready.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-5 hidden sm:mt-6 sm:block lg:mt-auto lg:pt-6"
      >
        <CozyJournalArt />
      </motion.div>

      <p className="relative z-10 mt-4 hidden text-[12px] font-medium tracking-wide text-[var(--ink-soft)] sm:mt-5 sm:block">
        Free personal journaling · Encrypted notes · Soft insights
      </p>
    </section>
  )
}

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="auth-split-shell relative flex min-h-[100dvh] w-full max-w-full flex-col overflow-x-hidden overflow-y-auto px-0 sm:h-[100dvh] sm:items-center sm:justify-center sm:p-5 lg:p-6">
      <div className="auth-split-frame book-shadow paper-texture relative flex min-h-[100dvh] w-full max-w-full flex-1 flex-col overflow-x-hidden overflow-y-auto rounded-none border-0 border-[var(--page-edge)] sm:h-full sm:min-h-0 sm:max-h-[min(860px,100%)] sm:max-w-5xl sm:flex-none sm:overflow-hidden sm:rounded-[24px] sm:border lg:rounded-[28px]">
        <AuthTopNav />

        <div className="auth-split-body grid w-full flex-1 content-start lg:min-h-0 lg:grid-cols-12 lg:content-stretch lg:overflow-y-auto">
          <div className="auth-brand-wrap w-full lg:col-span-5 lg:min-h-0 lg:border-r lg:border-[var(--page-edge)]/45 lg:overflow-y-auto">
            <AuthBrandPanel />
          </div>

          <div className="auth-form-panel relative flex w-full flex-col items-center justify-start px-3.5 pb-5 pt-0 sm:px-8 sm:py-8 lg:col-span-7 lg:min-h-0 lg:flex-1 lg:items-center lg:justify-center lg:overflow-y-auto">
            <div
              className="pointer-events-none absolute inset-0 opacity-50 max-sm:opacity-35"
              style={{
                background:
                  'radial-gradient(ellipse at 85% 0%, var(--accent-glow), transparent 52%), radial-gradient(ellipse at 12% 100%, var(--paper-deep), transparent 48%)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="auth-form-card relative mx-auto mt-5 w-full max-w-none sm:mt-0 sm:max-w-sm"
            >
              <div className="mb-4 sm:mb-6">
                <h1 className="font-display text-[1.35rem] font-semibold tracking-tight text-[var(--ink)] sm:text-[1.5rem]">
                  {title}
                </h1>
                {subtitle ? (
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--ink-soft)] sm:text-[13px]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
              {children}
              {footer ? (
                <div className="mt-4 space-y-1.5 border-t border-[var(--page-edge)]/55 pt-3.5 text-[13px] leading-relaxed text-[var(--ink-soft)] sm:mt-5 sm:pt-4">
                  {footer}
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthInput({ label, error, className = '', ...props }) {
  return (
    <label className="auth-input-label mb-3.5 block sm:mb-3.5">
      <span className="mb-1.5 block text-[12px] font-medium tracking-wide text-[var(--ink)] sm:mb-1.5">
        {label}
      </span>
      <input
        {...props}
        className={`auth-field min-h-11 w-full rounded-xl border border-[var(--page-edge)]/80 bg-[var(--surface-strong)] px-3.5 py-2.5 text-base text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-soft)]/55 focus:border-[var(--accent)] focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--accent)]/25 ${className}`}
      />
      {error && <span className="mt-1.5 block text-[12px] font-medium text-[#b8385c]">{error}</span>}
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
      ? 'auth-btn-primary text-white active:translate-y-px'
      : 'bg-[var(--surface)] text-[var(--ink)] border border-[var(--page-edge)] hover:bg-[var(--surface-strong)]'

  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={`auth-submit-btn inline-flex min-h-11 w-full items-center justify-center rounded-xl px-4 py-2.5 text-[15px] font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`}
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
      className="font-medium text-[var(--accent-deep)] underline-offset-4 transition hover:text-[var(--ink)] hover:underline"
    >
      {children}
    </button>
  )
}

export function AuthAlert({ tone = 'error', children }) {
  const bg =
    tone === 'success'
      ? 'bg-[#eef6f0] text-[#3d6b4f] border-[#cfe0d4]'
      : 'bg-[#faf0f2] text-[#9a4458] border-[#ead4da]'
  return (
    <div className={`mb-3.5 rounded-xl border px-3.5 py-2.5 text-[12px] font-medium leading-relaxed ${bg}`}>
      {children}
    </div>
  )
}
