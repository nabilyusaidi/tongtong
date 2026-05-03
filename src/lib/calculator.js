export function calculateFuelCost(fuelPrice, consumption, distance) {
  return (consumption / 100) * distance * fuelPrice
}

export function calculateTotalCost(fuelCost, toll) {
  return fuelCost + toll
}

export function calculatePerPerson(totalCost, passengers) {
  return totalCost / passengers
}
