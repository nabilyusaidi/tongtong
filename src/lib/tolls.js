// Open tolls — fixed fare, auto-detectable
export const CORRIDORS = [
  // Klang Valley — verified against Google Routes API Malay instruction text
  { id: 'ldp',     label: 'LDP',            highways: ['E11'],                                     oneWayToll: 2.00 },
  { id: 'sprint',  label: 'SPRINT',         highways: ['Lebuhraya SPRINT', 'E23'],                 oneWayToll: 1.50 },
  { id: 'kesas',   label: 'KESAS',          highways: ['Lbh Kemuning - Shah Alam', 'E13'],         oneWayToll: 1.60 },
  { id: 'duke',    label: 'DUKE',           highways: ['Lebuhraya Duta - Ulu Kelang', 'E33'],      oneWayToll: 2.00 },
  { id: 'akleh',   label: 'AKLEH',          highways: ['E12'],                                     oneWayToll: 1.50 },
  { id: 'federal', label: 'Federal Hwy',   highways: ['Lebuhraya Persekutuan'],                   oneWayToll: 0.50 },
  { id: 'smart',   label: 'SMART',          highways: ['Lebuhraya SMART'],                         oneWayToll: 2.00 },
  // Karak/Genting — verified: uses "Lebuhraya Karak/AH141" in instruction text
  { id: 'karak',   label: 'Karak/Genting', highways: ['Lebuhraya Karak'],                         oneWayToll: 5.70 },
]

// Closed tolls — distance-based fare, cannot be auto-calculated; prompt user to enter manually
// Verified match strings from real KL→Ipoh Routes API response (2026-05-07)
const CLOSED_TOLL_HIGHWAYS = [
  // PLUS North (E1) — confirmed: "Lebuhraya Utara - Selatan/E1" in TURN_RIGHT step
  { id: 'plus_north', label: 'PLUS',  highways: ['Lebuhraya Utara - Selatan'] },
  // PLUS South (E2) — same highway name, southern route
  { id: 'plus_south', label: 'PLUS',  highways: ['Lebuhraya Utara - Selatan'] },
  // ELITE (E6) — North-South Central Link; match string unverified, needs real route log
  { id: 'elite',      label: 'ELITE', highways: ['Lebuhraya Utara-Selatan Hubungan Tengah'] },
  // LPT East Coast Expressway (E8) — match string unverified
  { id: 'lpt',        label: 'LPT',   highways: ['Lebuhraya Pantai Timur'] },
]

function isOnHighway(step, highwayName) {
  const instruction = step.navigationInstruction?.instructions ?? ''
  const maneuver = step.navigationInstruction?.maneuver ?? ''

  if (!instruction.includes(highwayName)) return false

  // Most reliable: you are now on this road
  if (['NAME_CHANGE', 'MERGE'].includes(maneuver)) return true

  // Signage language — car is NOT on this road, just following signs
  if (instruction.includes('papan tanda')) return false
  if (instruction.includes('ke arah')) return false

  // RAMP steps are entrance/exit moves — never the road itself
  if (maneuver.startsWith('RAMP_')) return false

  // DEPART, STRAIGHT, TURN_* with no signage language — trust it
  return true
}

export function lookupToll(routeLegs) {
  if (!routeLegs || routeLegs.length === 0) return null

  const allSteps = routeLegs.flatMap(leg => leg.steps ?? [])

  // Check for closed-toll highways first — fare depends on entry/exit, cannot be auto-calculated
  for (const highway of CLOSED_TOLL_HIGHWAYS) {
    const onHighway = highway.highways.every(name =>
      allSteps.some(step => isOnHighway(step, name))
    )
    if (onHighway) return { toll: null, label: highway.label, needsManualToll: true }
  }

  // Open tolls — fixed fare, sum all matched corridors
  const matched = []
  for (const corridor of CORRIDORS) {
    const onCorridor = corridor.highways.every(highwayName =>
      allSteps.some(step => isOnHighway(step, highwayName))
    )
    if (onCorridor) matched.push(corridor)
  }

  if (matched.length === 0) return null

  const toll = matched.reduce((sum, c) => sum + c.oneWayToll, 0)
  const label = matched.map(c => c.label).join(' + ')
  return { toll, label, needsManualToll: false }
}