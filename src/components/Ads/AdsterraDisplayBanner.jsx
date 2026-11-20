import { useEffect, useState } from 'react'
import { ADSTERRA_DISPLAY } from '../../lib/adsterraConfig'

/**
 * 160×300 vertical banner via isolated HTML document.
 * Adsterra’s invoke script relies on document.currentScript (null for dynamic
 * React injects) — loading /ads/banner-160x300.html avoids that failure.
 *
 * If Adsterra returns no-fill, the iframe posts a message and we collapse the slot
 * (no fake impressions / no creative tampering).
 */
export default function AdsterraDisplayBanner({ className = '' }) {
  const [filled, setFilled] = useState(null) // null = waiting, true/false after check

  useEffect(() => {
    const onMessage = (event) => {
      const data = event?.data
      if (!data || data.source !== 'adsterra-display-160x300') return
      setFilled(!!data.filled)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  if (filled === false) return null

  return (
    <section className={`adsterra-display-section ${className}`} aria-label="Sponsored">
      <p className="adsterra-sponsored-label">Sponsored</p>
      <div className="adsterra-display-card adsterra-display-card--160x300">
        <iframe
          className="adsterra-display__frame"
          title="Sponsored"
          src="/ads/banner-160x300.html"
          width={ADSTERRA_DISPLAY.width}
          height={ADSTERRA_DISPLAY.height}
          scrolling="no"
          frameBorder="0"
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  )
}
