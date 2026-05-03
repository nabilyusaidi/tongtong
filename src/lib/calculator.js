export function calculateFuelCost(fuelPrice, consumption, distance) {
  return (consumption / 100) * distance * fuelPrice
}

export function calculateTotalCost(fuelCost, toll) {
  return fuelCost + toll
}

export function calculatePerPerson(totalCost, passengers) {
  return totalCost / passengers
}

export function calculateTrip({ fuelPrice, consumption, distance, toll, passengers, isReturn }) {
  const effectiveDistance = isReturn ? distance * 2 : distance
  const effectiveToll = isReturn ? toll * 2 : toll

  const fuelCost = calculateFuelCost(fuelPrice, consumption, effectiveDistance)
  const totalCost = calculateTotalCost(fuelCost, effectiveToll)
  const perPerson = calculatePerPerson(totalCost, passengers)

  return { fuelCost, tollCost: effectiveToll, totalCost, perPerson }
}
