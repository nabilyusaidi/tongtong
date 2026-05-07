import { useEffect, useState } from 'react'

const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
let loadState = 'idle' // 'idle' | 'loading' | 'loaded' | 'error'
const listeners = new Set()

export function useMapsLoader() {
  const [state, setState] = useState(() => {
    if (!key) return { google: null, loading: false, error: false }
    if (loadState === 'loaded') return { google: window.google, loading: false, error: false }
    if (loadState === 'error') return { google: null, loading: false, error: true }
    return { google: null, loading: true, error: false }
  })

  useEffect(() => {
    if (!key) return
    const update = s => setState(s)
    listeners.add(update)

    if (loadState === 'idle') {
      loadState = 'loading'
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`
      script.async = true
      script.onload = () => {
        loadState = 'loaded'
        listeners.forEach(fn => fn({ google: window.google, loading: false, error: false }))
      }
      script.onerror = () => {
        loadState = 'error'
        listeners.forEach(fn => fn({ google: null, loading: false, error: true }))
      }
      document.head.appendChild(script)
    }

    return () => listeners.delete(update)
  }, [])

  return state
}

export async function computeRoute(origin, destination) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const body = {
    origin:      { location: { latLng: { latitude: origin.lat(),      longitude: origin.lng()      } } },
    destination: { location: { latLng: { latitude: destination.lat(), longitude: destination.lng() } } },
    travelMode: 'DRIVE',
    regionCode: 'MY',
  }

  const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'routes.distanceMeters,routes.legs.steps.navigationInstruction',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`Routes API ${res.status}`)

  const data = await res.json()
  const route = data.routes?.[0]
  if (!route) throw new Error('No route returned')

  const distanceKm = Math.round(route.distanceMeters / 1000)
  const routeLegs = route.legs ?? []
  return { distanceKm, routeLegs }
}
