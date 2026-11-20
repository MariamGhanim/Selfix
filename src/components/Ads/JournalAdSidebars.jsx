import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AdsterraNativeBanner from './AdsterraNativeBanner'
import AdsterraDisplayBanner from './AdsterraDisplayBanner'

const DESKTOP_MQ = '(min-width: 1360px)'

/**
 * Fixed outer-margin ads only — portaled to <body>, desktop-only.
 * Never participates in the notebook flex layout.
 */
export default function JournalAdSidebars({ refreshToken = 'default' }) {
  const [mounted, setMounted] = useState(false)
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia(DESKTOP_MQ)
    const sync = () => setDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (!mounted || !desktop || typeof document === 'undefined') return null

  return createPortal(
    <div className="journal-ad-sidebars" data-journal-ads="1">
      <aside className="journal-ad-sidebar journal-ad-sidebar--left" aria-label="Sponsored">
        <AdsterraNativeBanner
          refreshToken={refreshToken}
          className="adsterra-native-section--sidebar"
        />
      </aside>
      <aside className="journal-ad-sidebar journal-ad-sidebar--right" aria-label="Sponsored">
        <AdsterraDisplayBanner className="adsterra-display-section--sidebar" />
      </aside>
    </div>,
    document.body,
  )
}
