import { useEffect, useRef } from 'react'
import { ADSTERRA_NATIVE } from '../../lib/adsterraConfig'

/** Prevents StrictMode double-inject and accidental reloads on tab changes. */
let nativeInjected = false

function injectNative(host, container) {
  if (nativeInjected && container.childNodes.length) return
  if (host.querySelector('script[data-adsterra-native]')) {
    nativeInjected = true
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.setAttribute('data-cfasync', 'false')
  script.dataset.adsterraNative = '1'
  script.src = ADSTERRA_NATIVE.scriptSrc
  host.insertBefore(script, container)
  nativeInjected = true
}

/**
 * Native Banner — load once and keep visible.
 * Do not clear/re-inject on tracker tab changes (that emptied the left rail).
 */
export default function AdsterraNativeBanner({ className = '' }) {
  const hostRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const container = containerRef.current
    if (!host || !container) return undefined

    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return
      injectNative(host, container)
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      // Do NOT clear the container or reset nativeInjected — ads must survive remounts/tab switches.
    }
  }, [])

  return (
    <section className={`adsterra-native-section ${className}`} aria-label="Sponsored">
      <p className="adsterra-sponsored-label">Sponsored</p>
      <div className="adsterra-native-card">
        <div ref={hostRef} className="adsterra-native__host">
          <div
            id={ADSTERRA_NATIVE.containerId}
            ref={containerRef}
            className="adsterra-native__slot"
          />
        </div>
      </div>
    </section>
  )
}
