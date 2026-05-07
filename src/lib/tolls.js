export const CORRIDORS = [
  // Klang Valley — verified against Google Routes API Malay instruction text
  { id: 'ldp',     label: 'LDP',            highways: ['E11'],                                          oneWayToll: 2.00 },
  { id: 'sprint',  label: 'SPRINT',          highways: ['Lebuhraya SPRINT', 'E23'],                      oneWayToll: 1.50 },
  { id: 'kesas',   label: 'KESAS',           highways: ['Lbh Kemuning - Shah Alam', 'E13'],              oneWayToll: 1.60 },
  { id: 'duke',    label: 'DUKE',            highways: ['Lebuhraya Duta - Ulu Kelang', 'E33'],           oneWayToll: 2.00 },
  { id: 'akleh',   label: 'AKLEH',           highways: ['E12'],                                              oneWayToll: 1.50 },
  { id: 'federal', label: 'Federal Highway', highways: ['Lebuhraya Persekutuan'],                        oneWayToll: 0.50 },
  { id: 'smart',   label: 'SMART',            highways: ['Lebuhraya SMART'],                              oneWayToll: 2.00 },
  // Karak/Genting — verified: uses "Lebuhraya Karak/AH141" in instruction text
  { id: 'karak',   label: 'Karak/Genting',   highways: ['Lebuhraya Karak'],                              oneWayToll: 5.70 },
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

  // Collect all steps across all legs
  const allSteps = routeLegs.flatMap(leg => leg.steps ?? [])

  const matched = []
  for (const corridor of CORRIDORS) {
    // Every highway in the corridor must have at least one step confirming travel on it
    const onCorridor = corridor.highways.every(highwayName =>
      allSteps.some(step => isOnHighway(step, highwayName))
    )
    if (onCorridor) matched.push(corridor)
  }

  if (matched.length === 0) return null

  const toll = matched.reduce((sum, c) => sum + c.oneWayToll, 0)
  const label = matched.map(c => c.label).join(' + ')
  return { toll, label }
}