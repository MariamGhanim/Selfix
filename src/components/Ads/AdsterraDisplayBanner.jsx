import { useEffect, useRef } from 'react'
import { ADSTERRA_DISPLAY } from '../../lib/adsterraConfig'

/**
 * 300×250 display banner for Blog / Guides only.
 * Injects atOptions + invoke.js once per mount (StrictMode-safe via deferred load).
 * Card chrome only — script key/src unchanged.
 */
export default function AdsterraDisplayBanner({ className = '' }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled || host.dataset.adsterraLoaded === '1') return
      if (host.querySelector('script[data-adsterra-display]')) {
        host.dataset.adsterraLoaded = '1'
        return
      }

      const options = {
        key: ADSTERRA_DISPLAY.key,
        format: 'iframe',
        height: ADSTERRA_DISPLAY.height,
        width: ADSTERRA_DISPLAY.width,
        params: {},
      }

      window.atOptions = options

      const conf = document.createElement('script')
      conf.type = 'text/javascript'
      conf.dataset.adsterraDisplay = 'conf'
      conf.text = `atOptions = ${JSON.stringify(options)};`

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.dataset.adsterraDisplay = 'invoke'
      script.src = ADSTERRA_DISPLAY.scriptSrc

      host.append(conf, script)
      host.dataset.adsterraLoaded = '1'
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <section className={`adsterra-display-section ${className}`} aria-label="Sponsored">
      <p className="adsterra-sponsored-label">Sponsored</p>
      <div className="adsterra-display-card">
        <div
          ref={hostRef}
          className="adsterra-display__host"
          style={{
            width: ADSTERRA_DISPLAY.width,
            maxWidth: '100%',
            minHeight: ADSTERRA_DISPLAY.height,
          }}
        />
      </div>
    </section>
  )
}
