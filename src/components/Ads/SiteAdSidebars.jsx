import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import AdsterraNativeBanner from './AdsterraNativeBanner'
import AdsterraDisplayBanner from './AdsterraDisplayBanner'

const DESKTOP_MQ = '(min-width: 1360px)'

/**
 * Global fixed sidebars for all routes (journal, blog, about, …).
 * Desktop-only; portaled to <body> so they never enter page flex layouts.
 */
export default function SiteAdSidebars() {
  const [desktop, setDesktop] = useState(false)
  // Stay mounted after the first wide layout. Unmounting on DevTools/resize
  // destroys the filled slots, and Adsterra will not paint them again.
  const [keepAds, setKeepAds] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const sync = () => {
      const wide = mq.matches
      setDesktop(wide)
      if (wide) setKeepAds(true)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  if (!keepAds || typeof document === 'undefined') return null

  return createPortal(
    <div className="journal-ad-sidebars" data-journal-ads="1" data-selfix-portal="1">
      <aside
        className={`journal-ad-sidebar journal-ad-sidebar--left${desktop ? '' : ' journal-ad-sidebar--parked'}`}
        aria-label="Sponsored"
        aria-hidden={desktop ? undefined : true}
      >
        <AdsterraNativeBanner className="adsterra-native-section--sidebar" />
      </aside>
      <aside
        className={`journal-ad-sidebar journal-ad-sidebar--right${desktop ? '' : ' journal-ad-sidebar--parked'}`}
        aria-label="Sponsored"
        aria-hidden={desktop ? undefined : true}
      >
        <AdsterraDisplayBanner className="adsterra-display-section--sidebar" />
      </aside>
    </div>,
    document.body,
  )
}
