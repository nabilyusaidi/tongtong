const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export async function computeRoute(origin, destination) {
  const body = {
    origin:      { location: { latLng: { latitude: origin.lat,      longitude: origin.lng      } } },
    destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
    travelMode: 'DRIVE',
    regionCode: 'MY',
  }

  const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
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
