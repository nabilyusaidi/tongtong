export const CORRIDORS = [
  // Klang Valley
  { id: 'ldp',      label: 'LDP',            highways: ['Lebuhraya Damansara-Puchong', 'LDP'],                         oneWayToll: 2.00 },
  { id: 'sprint',   label: 'SPRINT',          highways: ['Sistem Penyuraian Trafik KL Barat', 'SPRINT'],                oneWayToll: 1.50 },
  { id: 'kesas',    label: 'KESAS',           highways: ['Kemuning-Shah Alam', 'KESAS'],                                oneWayToll: 1.60 },
  { id: 'nkve',     label: 'NKVE',            highways: ['New Klang Valley Expressway', 'NKVE'],                        oneWayToll: 2.50 },
  { id: 'duke',     label: 'DUKE',            highways: ['Duta-Ulu Kelang Expressway', 'DUKE'],                         oneWayToll: 2.00 },
  { id: 'akleh',    label: 'AKLEH',           highways: ['Ampang-KL Elevated Highway', 'AKLEH'],                        oneWayToll: 1.50 },
  { id: 'federal',  label: 'Federal Highway', highways: ['Federal Highway', 'Lebuhraya Persekutuan'],                   oneWayToll: 0.50 },
  // PLUS intercity
  { id: 'kl-seremban', label: 'KL–Seremban',  highways: ['E2', 'PLUS South'],                                          oneWayToll: 6.20  },
  { id: 'kl-ipoh',     label: 'KL–Ipoh',      highways: ['E1', 'North-South Expressway'],                              oneWayToll: 13.40 },
  { id: 'kl-penang',   label: 'KL–Penang',    highways: ['E1', 'North-South Expressway', 'Penang Bridge'],             oneWayToll: 23.80 },
  { id: 'kl-jb',       label: 'KL–JB',        highways: ['E2', 'E1', 'North-South Expressway'],                       oneWayToll: 23.50 },
  { id: 'kl-karak',    label: 'KL–Karak',     highways: ['E8', 'Karak Highway', 'Lebuhraya Karak'],                   oneWayToll: 5.70  },
]

export function lookupToll(routeLegs) {
  if (!routeLegs || routeLegs.length === 0) return null

  const names = new Set()
  for (const leg of routeLegs) {
    for (const step of (leg.steps ?? [])) {
      const text = step.navigationInstruction?.instructions ?? ''
      if (text) names.add(text)
    }
  }

  const nameStr = [...names].join(' ')
  for (const corridor of CORRIDORS) {
    if (corridor.highways.every(h => nameStr.includes(h))) {
      return corridor.oneWayToll
    }
  }
  return null
}
