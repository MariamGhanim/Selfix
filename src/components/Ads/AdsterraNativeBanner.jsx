import { useEffect, useRef } from 'react'
import { ADSTERRA_NATIVE } from '../../lib/adsterraConfig'

/** Module-level so StrictMode remounts and tab switches share one cooldown clock. */
let lastNativeRefreshAt = 0

function injectNative(host, container) {
  host.querySelectorAll('script[data-adsterra-native]').forEach((node) => node.remove())
  container.replaceChildren()

  const script = document.createElement('script')
  script.async = true
  script.setAttribute('data-cfasync', 'false')
  script.dataset.adsterraNative = '1'
  script.src = ADSTERRA_NATIVE.scriptSrc
  host.insertBefore(script, container)
}

/**
 * Native Banner — left rail on desktop, stacked below book on smaller screens.
 * Wrapper/card styling only — container id and script src stay untouched.
 */
export default function AdsterraNativeBanner({ refreshToken = 'default', className = '' }) {
  const hostRef = useRef(null)
  const containerRef = useRef(null)
  const lastTokenRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    const container = containerRef.current
    if (!host || !container) return undefined

    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return

      const now = Date.now()
      const firstLoad = lastNativeRefreshAt === 0
      const tokenChanged = lastTokenRef.current !== refreshToken
      const cooled =
        now - lastNativeRefreshAt >= ADSTERRA_NATIVE.refreshCooldownMs
      const slotEmpty =
        !container.childNodes.length &&
        !host.querySelector('script[data-adsterra-native]')

      if (!firstLoad && !cooled && slotEmpty) {
        lastTokenRef.current = refreshToken
        injectNative(host, container)
        return
      }

      if (!firstLoad && (!tokenChanged || !cooled)) return

      lastNativeRefreshAt = now
      lastTokenRef.current = refreshToken
      injectNative(host, container)
    }, 0)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [refreshToken])

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
