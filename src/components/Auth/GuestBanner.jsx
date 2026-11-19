import { useAuth } from '../../context/AuthContext'

export default function GuestBanner() {
  const { exitGuestMode } = useAuth()

  return (
    <div
      role="status"
      className="guest-banner sticky top-0 z-[70] flex w-full items-center justify-center gap-2 border-b border-[var(--page-edge)]/60 bg-[var(--accent-glow)]/90 px-3 py-2 text-center backdrop-blur-md sm:gap-3 sm:px-4"
    >
      <p className="max-w-3xl text-[11px] font-semibold leading-snug text-[var(--ink)] sm:text-[12px]">
        You are in Guest Mode — your entries stay on this device for now.{' '}
        <span className="font-medium text-[var(--ink-soft)]">
          Sign in to save your journal to the cloud and sync across devices.
        </span>
      </p>
      <button
        type="button"
        onClick={exitGuestMode}
        className="shrink-0 rounded-full bg-[var(--accent-deep)] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm transition hover:brightness-105 sm:px-3.5"
      >
        Sign In to Save
      </button>
    </div>
  )
}
