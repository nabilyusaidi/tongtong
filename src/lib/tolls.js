// Open tolls — fixed fare, auto-detectable
// All match strings verified against real Google Routes API step data
export const CORRIDORS = [
  // Klang Valley
  { id: 'ldp',          label: 'LDP',          highways: ['E11'],                             oneWayToll: 2.00 },
  { id: 'sprint',       label: 'SPRINT',        highways: ['Lebuhraya SPRINT', 'E23'],         oneWayToll: 1.50 },
  { id: 'kesas',        label: 'KESAS',         highways: ['Lbh Kemuning - Shah Alam', 'E13'], oneWayToll: 1.60 },
  { id: 'duke',         label: 'DUKE',          highways: ['Lebuhraya Duta - Ulu Kelang', 'E33'], oneWayToll: 2.00 },
  { id: 'akleh',        label: 'AKLEH',         highways: ['E12'],                             oneWayToll: 1.50 },
  { id: 'federal',      label: 'Federal Hwy',   highways: ['Lebuhraya Persekutuan'],           oneWayToll: 0.50 },
  { id: 'smart',        label: 'SMART',         highways: ['Lebuhraya SMART'],                 oneWayToll: 2.00 },
  // Verified 2026-05-07: "Lebuhraya Baru Pantai/E10" in MERGE step
  { id: 'npe',          label: 'NPE',           highways: ['Lebuhraya Baru Pantai'],           oneWayToll: 1.50 },
  // Verified 2026-05-07: "Lebuhraya Cheras - Kajang/E7" in NAME_CHANGE step
  { id: 'cheras_kajang', label: 'Cheras-Kajang', highways: ['Lebuhraya Cheras - Kajang'],      oneWayToll: 1.50 },
  // Verified 2026-05-07: "Sistem Lingkaran-Lebuhraya Kajang/E18" in NAME_CHANGE step
  { id: 'silk',         label: 'SILK',          highways: ['Sistem Lingkaran-Lebuhraya Kajang'], oneWayToll: 1.50 },
  // Karak/Genting — verified: "Lebuhraya Karak/AH141" in NAME_CHANGE step
  { id: 'karak',        label: 'Karak/Genting', highways: ['Lebuhraya Karak'],                 oneWayToll: 5.70 },
  // Penang Bridge — verified 2026-05-07: "Jambatan Pulau Pinang/E36" in NAME_CHANGE step
  { id: 'penang_bridge', label: 'Penang Bridge', highways: ['Jambatan Pulau Pinang'],          oneWayToll: 7.00 },
]

// Closed tolls — distance-based fare, cannot be auto-calculated; prompt user to enter manually
const CLOSED_TOLL_HIGHWAYS = [
  // PLUS North (E1) — verified 2026-05-07: "Lebuhraya Utara - Selatan/E1" in STRAIGHT/TURN step
  // PLUS South (E2) — verified 2026-05-07: "Lebuhraya Utara-Selatan/E2" in NAME_CHANGE step
  // Note: both share the same match string pattern; one entry covers both
  { id: 'plus',  label: 'PLUS',  highways: ['Lebuhraya Utara - Selatan'] },
  { id: 'plus2', label: 'PLUS',  highways: ['Lebuhraya Utara-Selatan'] },
  // ELITE (E6) — match string unverified, needs real KL→Nilai/KLIA route log
  { id: 'elite', label: 'ELITE', highways: ['Lebuhraya Utara-Selatan Hubungan Tengah'] },
  // LPT East Coast Expressway — match string unverified, needs real KL→Kuantan route log
  { id: 'lpt',   label: 'LPT',   highways: ['Lebuhraya Pantai Timur'] },
  // SKVE (E26) — match string unverified, needs real Klang→Putrajaya route log
  { id: 'skve',  label: 'SKVE',  highways: ['Lebuhraya SKVE'] },
  // SDE (E22) — match string unverified, needs real JB→Desaru route log
  { id: 'sde',   label: 'SDE',   highways: ['Lebuhraya Senai - Desaru'] },
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

// TEMP: debug helper for verifying highway match strings — remove before ship
export function debugHighwaySteps(routeResponse, searchTerm) {
  const steps = routeResponse.routes[0].legs.flatMap(l => l.steps ?? [])
  const hits = steps.filter(s => s.navigationInstruction?.instructions?.includes(searchTerm))
  console.log(`Steps containing "${searchTerm}":`,
    hits.map(s => ({
      maneuver: s.navigationInstruction.maneuver,
      instruction: s.navigationInstruction.instructions,
      wouldMatch: isOnHighway(s, searchTerm),
    }))
  )
}

export function lookupToll(routeLegs) {
  if (!routeLegs || routeLegs.length === 0) return null

  const allSteps = routeLegs.flatMap(leg => leg.steps ?? [])

  // Open tolls first — fixed fare, sum all matched corridors
  // Must run before closed-toll check so Penang Bridge (open) takes priority over PLUS (closed)
  const matched = []
  for (const corridor of CORRIDORS) {
    const onCorridor = corridor.highways.every(highwayName =>
      allSteps.some(step => isOnHighway(step, highwayName))
    )
    if (onCorridor) matched.push(corridor)
  }

  if (matched.length > 0) {
    const toll = matched.reduce((sum, c) => sum + c.oneWayToll, 0)
    const label = matched.map(c => c.label).join(' + ')
    return { toll, label, needsManualToll: false }
  }

  // Closed tolls — distance-based fare, cannot be auto-calculated; prompt user to enter manually
  for (const highway of CLOSED_TOLL_HIGHWAYS) {
    const onHighway = highway.highways.every(name =>
      allSteps.some(step => isOnHighway(step, name))
    )
    if (onHighway) return { toll: null, label: highway.label, needsManualToll: true }
  }

  return null
}