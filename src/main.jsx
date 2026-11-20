import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ensureAdsterraSocialBar, watchAdsterraSocialBarFloats } from './lib/adsterraSocialBar'

document.documentElement.classList.add('js')
document.getElementById('seo-static')?.remove()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Social Bar once on boot (also in index.html; this covers HMR / missed HTML inject)
ensureAdsterraSocialBar()
watchAdsterraSocialBarFloats()
