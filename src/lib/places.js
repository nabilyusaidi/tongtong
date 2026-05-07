// src/lib/places.js
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export async function fetchSuggestions(query) {
  if (!query || query.length < 2) return []
  const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      input: query,
      includedRegionCodes: ['my'],
    }),
  })
  if (!res.ok) throw new Error(`Places autocomplete ${res.status}`)
  const data = await res.json()
  return (data.suggestions ?? []).map(s => ({
    placeId: s.placePrediction.placeId,
    text: s.placePrediction.text.text,
  }))
}

export async function fetchLocation(placeId) {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'location',
    },
  })
  if (!res.ok) throw new Error(`Place details ${res.status}`)
  const data = await res.json()
  const { latitude, longitude } = data.location
  return { lat: latitude, lng: longitude }
}
