import { ADSTERRA_DISPLAY } from '../../lib/adsterraConfig'

/**
 * 160×300 vertical banner via isolated HTML document.
 * Adsterra’s invoke script relies on document.currentScript (null for dynamic
 * React injects) — loading /ads/banner-160x300.html avoids that failure.
 */
export default function AdsterraDisplayBanner({ className = '' }) {
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
          allow="attribution-reporting"
        />
      </div>
    </section>
  )
}
