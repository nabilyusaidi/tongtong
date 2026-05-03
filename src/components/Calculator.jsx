import { useEffect, useMemo, useState } from 'react'
import { calculateTrip } from '../lib/calculator'

export default function Calculator({ onResultChange, resultTargetRef }) {
  const [fuelPrice, setFuelPrice] = useState('')
  const [consumption, setConsumption] = useState('')
  const [consumptionUnit, setConsumptionUnit] = useState('km/L')
  const [distance, setDistance] = useState('')
  const [toll, setToll] = useState('')
  const [passengers, setPassengers] = useState('2')

  const parsedFuelPrice = parseFloat(fuelPrice)
  const rawConsumption = parseFloat(consumption)
  const parsedConsumption = consumptionUnit === 'km/L' && rawConsumption > 0
    ? 100 / rawConsumption
    : rawConsumption
  const parsedDistance = parseFloat(distance)
  const parsedToll = parseFloat(toll) || 0
  const parsedPassengers = Number(passengers)
  const passengerError = getPassengerError(passengers, parsedPassengers)
  const hasValidPassengers = passengers !== '' && !passengerError

  const hasValidInputs =
    parsedFuelPrice > 0 && parsedConsumption > 0 && parsedDistance > 0 && hasValidPassengers

  const result = useMemo(() => (
    hasValidInputs
      ? calculateTrip({
          fuelPrice: parsedFuelPrice,
          consumption: parsedConsumption,
          distance: parsedDistance,
          toll: parsedToll,
          passengers: parsedPassengers,
          isReturn: false,
        })
      : null
  ), [hasValidInputs, parsedFuelPrice, parsedConsumption, parsedDistance, parsedToll, parsedPassengers])

  useEffect(() => {
    onResultChange?.(result)
  }, [onResultChange, result])

  function handleCalculate() {
    if (result) {
      setTimeout(() => resultTargetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  function toggleConsumptionUnit() {
    setConsumptionUnit(u => u === 'L/100km' ? 'km/L' : 'L/100km')
    setConsumption('')
  }

  return (
    <div className="space-y-3">
      <Section label="Trip details">
        <div className="space-y-1">
          <Field
            label="Fuel Price"
            required
            description="Current pump price"
            unit="RM/L"
            value={fuelPrice}
            onChange={setFuelPrice}
            placeholder="1.99"
            step="0.01"
          />
          <Divider />
          <Field
            label="Fuel Consumption"
            required
            description={consumptionUnit === 'L/100km' ? 'Litres per 100 km' : 'Kilometres per litre'}
            unit={consumptionUnit}
            onUnitClick={toggleConsumptionUnit}
            value={consumption}
            onChange={setConsumption}
            placeholder={consumptionUnit === 'L/100km' ? '8' : '12.5'}
            step="0.1"
          />
          <Divider />
          <Field
            label="Distance"
            required
            description={<>Enter total distance. Double it<br />for return trips.</>}
            unit="km"
            value={distance}
            onChange={setDistance}
            placeholder="30"
            step="1"
          />
          <Divider />
          <Field
            label="Toll"
            description="Double it for return trips."
            unit="RM"
            value={toll}
            onChange={setToll}
            placeholder="0.00"
            step="0.10"
          />
        </div>
      </Section>

      <Section label="Passengers">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Number of people
                {passengers === '' && <span className="ml-1 text-red-500 dark:text-red-400">*</span>}
              </p>
              <p className="text-xs text-slate-500 dark:text-neutral-500">Including the driver</p>
            </div>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="10"
              step="1"
              value={passengers}
              onChange={e => setPassengers(e.target.value)}
              placeholder="2"
              className={`w-24 appearance-none text-center bg-slate-100 dark:bg-neutral-800 border rounded-lg px-3 py-2 text-sm font-medium text-slate-950 dark:text-white placeholder:text-center placeholder:text-slate-600 dark:placeholder:text-neutral-600 shadow-inner shadow-slate-300/40 dark:shadow-none focus:outline-none focus:ring-1 ${
                passengerError
                  ? 'border-red-300 dark:border-red-400/50 focus:ring-red-500 dark:focus:ring-red-400'
                  : 'border-slate-200 dark:border-white/5 focus:ring-blue-500 dark:focus:ring-blue-400'
              }`}
            />
          </div>
          {passengerError && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">{passengerError}</p>
          )}
        </div>
      </Section>

      <button
        type="button"
        onClick={handleCalculate}
        disabled={!hasValidInputs}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all
          bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white
          disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500 disabled:cursor-not-allowed"
      >
        {hasValidInputs ? 'Calculate →' : 'Fill in your trip details'}
      </button>
    </div>
  )
}

function Section({ label, children }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-3 shadow-md shadow-slate-300/50 dark:shadow-none">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-500">{label}</p>
      {children}
    </div>
  )
}

function Field({ label, required, description, unit, onUnitClick, value, onChange, placeholder, step }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {label}
          {required && value === '' && <span className="ml-1 text-red-500 dark:text-red-400">*</span>}
        </p>
        <p className="text-xs text-slate-600 dark:text-neutral-500">{description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          step={step}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-24 appearance-none text-center bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 dark:text-white placeholder:text-center placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-neutral-600 shadow-sm shadow-slate-200/60 dark:shadow-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        {onUnitClick ? (
          <button
            type="button"
            onClick={onUnitClick}
            className="text-xs font-semibold w-16 text-center px-1.5 py-1 rounded-md border border-blue-300 dark:border-blue-400/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 active:scale-95 transition-all"
          >
            {unit}
          </button>
        ) : (
          <span className="text-xs text-center text-slate-600 dark:text-neutral-500 w-16">{unit}</span>
        )}
      </div>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-slate-100 dark:border-white/5" />
}

function getPassengerError(value, parsedValue) {
  if (value === '') return ''
  if (!Number.isInteger(parsedValue)) return 'Use a whole number of passengers.'
  if (parsedValue < 1) return 'Enter at least 1 passenger.'
  if (parsedValue > 10) return 'Maximum 10 passengers.'
  return ''
}
