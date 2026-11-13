export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden px-4 py-6">
      <div className="book-shadow paper-texture relative w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--page-edge)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse at 20% 0%, var(--accent-glow), transparent 55%), radial-gradient(ellipse at 90% 100%, var(--paper-deep), transparent 50%)',
          }}
        />
        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          <div className="mb-6 text-center">
            <p className="font-display text-3xl font-semibold tracking-tight text-[var(--accent-deep)]">
              Selfix
            </p>
            <h1 className="mt-2 font-display text-xl font-semibold text-[var(--ink)]">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--ink-soft)]">{subtitle}</p>
            )}
          </div>
          {children}
          {footer && <div className="mt-5 text-center text-sm text-[var(--ink-soft)]">{footer}</div>}
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
        className={`w-full rounded-2xl border border-[var(--page-edge)] bg-white/85 px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--ink-soft)]/70 focus:ring-2 focus:ring-[var(--accent)] ${className}`}
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
      : 'bg-white/85 text-[var(--ink)] border border-[var(--page-edge)] hover:bg-white'

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
  const bg = tone === 'success' ? 'bg-[#e8f5e9] text-[#2e7d4f]' : 'bg-[#fde8ee] text-[#b8385c]'
  return (
    <div className={`mb-3 rounded-2xl px-3 py-2 text-xs font-semibold ${bg}`}>{children}</div>
  )
}
