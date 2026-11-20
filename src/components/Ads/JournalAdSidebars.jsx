import { createPortal } from 'react-dom'
import AdsterraNativeBanner from './AdsterraNativeBanner'
import AdsterraDisplayBanner from './AdsterraDisplayBanner'

/**
 * Fixed outer-margin ads only — never inside the notebook layout.
 * Visible at min-width: 1360px via CSS (.journal-ad-sidebars).
 */
export default function JournalAdSidebars({ refreshToken = 'default' }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="journal-ad-sidebars" aria-hidden={false}>
      <aside className="journal-ad-sidebar journal-ad-sidebar--left" aria-label="Sponsored">
        <AdsterraNativeBanner refreshToken={refreshToken} className="adsterra-native-section--sidebar" />
      </aside>
      <aside className="journal-ad-sidebar journal-ad-sidebar--right" aria-label="Sponsored">
        <AdsterraDisplayBanner className="adsterra-display-section--sidebar" />
      </aside>
    </div>,
    document.body,
  )
}
