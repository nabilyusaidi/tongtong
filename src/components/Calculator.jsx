import { useState } from 'react'
import { calculateTrip } from '../lib/calculator'
import ResultCard from './ResultCard'
import PassengerChips from './PassengerChips'

export default function Calculator() {
  const [fuelPrice, setFuelPrice] = useState('')
  const [consumption, setConsumption] = useState('')
  const [distance, setDistance] = useState('')
  const [toll, setToll] = useState('')
  const [passengers, setPassengers] = useState(2)
  const [isReturn, setIsReturn] = useState(false)

  const parsedFuelPrice = parseFloat(fuelPrice)
  const parsedConsumption = parseFloat(consumption)
  const parsedDistance = parseFloat(distance)
  const parsedToll = parseFloat(toll) || 0

  const hasValidInputs =
    parsedFuelPrice > 0 && parsedConsumption > 0 && parsedDistance > 0

  const result = hasValidInputs
    ? calculateTrip({
        fuelPrice: parsedFuelPrice,
        consumption: parsedConsumption,
        distance: parsedDistance,
        toll: parsedToll,
        passengers,
        isReturn,
      })
    : null

  return (
    <div className="max-w-md mx-auto px-4 py-8 space-y-6">
      <div className="flex gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            checked={!isReturn}
            onChange={() => setIsReturn(false)}
            className="accent-black"
          />
          <span className="text-sm font-medium">One-way</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            checked={isReturn}
            onChange={() => setIsReturn(true)}
            className="accent-black"
          />
          <span className="text-sm font-medium">Return</span>
        </label>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Fuel price (RM/L)</label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.01"
            value={fuelPrice}
            onChange={e => setFuelPrice(e.target.value)}
            placeholder="e.g. 2.05"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Consumption (L/100km)</label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.1"
            value={consumption}
            onChange={e => setConsumption(e.target.value)}
            placeholder="e.g. 8"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Distance (km)</label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="1"
            value={distance}
            onChange={e => setDistance(e.target.value)}
            placeholder="e.g. 30"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Toll (RM) <span className="text-gray-400 font-normal">optional</span></label>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.10"
            value={toll}
            onChange={e => setToll(e.target.value)}
            placeholder="e.g. 2.00"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Passengers (inc. driver)</label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPassengers(p => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-full border border-gray-300 text-lg font-medium flex items-center justify-center hover:bg-gray-50"
          >
            −
          </button>
          <span className="text-xl font-semibold w-6 text-center">{passengers}</span>
          <button
            type="button"
            onClick={() => setPassengers(p => Math.min(10, p + 1))}
            className="w-10 h-10 rounded-full border border-gray-300 text-lg font-medium flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>
      </div>

      {result && <ResultCard result={result} />}
      {result && <PassengerChips result={result} passengers={passengers} />}
    </div>
  )
}
