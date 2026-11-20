import { useEffect, useRef } from 'react'
import { ADSTERRA_DISPLAY } from '../../lib/adsterraConfig'

/**
 * 300×250 display banner for Blog / Guides only.
 * Injects atOptions + invoke.js once per mount (StrictMode-safe via deferred load).
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

      // Adsterra reads the global atOptions when invoke.js runs.
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
    <aside
      className={`adsterra-display flex w-full max-w-full min-w-0 justify-center overflow-x-hidden ${className}`}
      aria-label="Sponsored"
    >
      <div
        ref={hostRef}
        className="adsterra-display__host mx-auto flex max-w-full min-w-0 items-center justify-center overflow-x-hidden"
        style={{
          width: ADSTERRA_DISPLAY.width,
          maxWidth: '100%',
          minHeight: ADSTERRA_DISPLAY.height,
        }}
      />
    </aside>
  )
}
