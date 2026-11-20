import { useEffect, useRef } from 'react'
import { ADSTERRA_DISPLAY } from '../../lib/adsterraConfig'

/**
 * Adsterra iframe banners often call document.write(). After page load that is a no-op,
 * so we temporarily redirect writes into the host element while invoke.js runs.
 */
function loadBanner(host, options, scriptSrc) {
  window.atOptions = options

  const conf = document.createElement('script')
  conf.type = 'text/javascript'
  conf.dataset.adsterraDisplay = 'conf'
  conf.text = `atOptions = ${JSON.stringify(options)};`

  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.dataset.adsterraDisplay = 'invoke'
  script.src = scriptSrc

  const doc = document
  const originalWrite = doc.write.bind(doc)
  const originalWriteln = typeof doc.writeln === 'function' ? doc.writeln.bind(doc) : null

  const writeIntoHost = (...chunks) => {
    try {
      host.insertAdjacentHTML('beforeend', chunks.join(''))
    } catch {
      // ignore malformed fragments from the network
    }
  }

  doc.write = writeIntoHost
  if (originalWriteln) doc.writeln = (...chunks) => writeIntoHost(...chunks, '\n')

  const restore = () => {
    doc.write = originalWrite
    if (originalWriteln) doc.writeln = originalWriteln
  }

  script.onload = restore
  script.onerror = restore

  host.append(conf, script)

  // Safety restore if onload never fires
  window.setTimeout(restore, 4000)
}

/**
 * 160×300 vertical display banner (global right sidebar).
 * StrictMode-safe: deferred inject; only marks loaded after scripts are appended.
 */
export default function AdsterraDisplayBanner({ className = '' }) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    let cancelled = false
    const timer = window.setTimeout(() => {
      if (cancelled) return
      // Already has an iframe / creative from a prior successful inject
      if (host.querySelector('iframe, ins, img')) return
      if (host.dataset.adsterraLoaded === '1' && host.querySelector('script[data-adsterra-display]')) {
        return
      }

      // Clear a failed empty inject (scripts only, no creative)
      host.replaceChildren()

      const options = {
        key: ADSTERRA_DISPLAY.key,
        format: 'iframe',
        height: ADSTERRA_DISPLAY.height,
        width: ADSTERRA_DISPLAY.width,
        params: {},
      }

      loadBanner(host, options, ADSTERRA_DISPLAY.scriptSrc)
      host.dataset.adsterraLoaded = '1'
    }, 50)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <section className={`adsterra-display-section ${className}`} aria-label="Sponsored">
      <p className="adsterra-sponsored-label">Sponsored</p>
      <div className="adsterra-display-card adsterra-display-card--160x300">
        <div
          ref={hostRef}
          className="adsterra-display__host adsterra-display__host--160x300"
          id={`adsterra-display-${ADSTERRA_DISPLAY.key}`}
        />
      </div>
    </section>
  )
}
