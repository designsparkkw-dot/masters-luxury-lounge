import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window {
    __appBootAt?: number
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

// Fade out the inline preloader once the app has mounted, keeping it up for a
// brief minimum so it never flashes on fast loads.
const preloader = document.getElementById('preloader')
if (preloader) {
  const startedAt = window.__appBootAt ?? performance.now()
  const minVisibleMs = 700
  const hide = () => {
    preloader.classList.add('preloader--hide')
    preloader.addEventListener('transitionend', () => preloader.remove(), { once: true })
    // safety net in case the transition doesn't fire
    setTimeout(() => preloader.remove(), 900)
  }
  const elapsed = performance.now() - startedAt
  setTimeout(hide, Math.max(0, minVisibleMs - elapsed))
}
