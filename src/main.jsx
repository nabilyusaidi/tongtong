import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'
// TEMP: expose toll debug helper in browser console — remove before ship
import { debugHighwaySteps } from './lib/tolls.js'
if (typeof window !== 'undefined') window.debugHighwaySteps = debugHighwaySteps

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
