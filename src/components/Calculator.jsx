import { useEffect, useMemo, useRef, useState } from 'react'
import { calculateTrip } from '../lib/calculator'
import { computeRoute } from '../lib/maps'
import PlacesInput from './PlacesInput'
import { lookupToll } from '../lib/tolls'

const CAR_PRESETS = {
  hatchback: { label: 'Hatchback', consumption: 6.5 },
  sedan:     { label: 'Sedan',     consumption: 7.5 },
  suv:       { label: 'SUV',       consumption: 9.5 },
  mpv:       { label: 'MPV',       consumption: 11.0 },
}

export default function Calculator({ onResultChange, resultTargetRef }) {
  const [budi95Price, setBudi95Price] = useState(1.99)
  const [marketPrice, setMarketPrice] = useState(4.90)
  const [useMarketRate, setUseMarketRate] = useState(false)
  const [priceDate, setPriceDate] = useState(null)
  const [carType, setCarType] = useState('hatchback')
  const [distance, setDistance] = useState('')
  const [toll, setToll] = useState('')
  const [passengers, setPassengers] = useState('2')
  const [autoToll, setAutoToll] = useState(null)
  const [autoTollLabel, setAutoTollLabel] = useState(null)
  const [hasToll, setHasToll] = useState(false)
  const [tollOverridden, setTollOverridden] = useState(false)

  const fuelPrice = useMarketRate && marketPrice !== null ? marketPrice : budi95Price
  const parsedConsumption = CAR_PRESETS[carType].consumption
  const parsedDistance = parseFloat(distance)
  const parsedToll = parseFloat(toll) || 0
  function getEffectiveToll() {
    if (!hasToll) return 0
    if (tollOverridden) return parsedToll
    return autoToll ?? parsedToll
  }
  const effectiveToll = getEffectiveToll()
  const parsedPassengers = Number(passengers)
  const passengerError = getPassengerError(passengers, parsedPassengers)
  const hasValidPassengers = passengers !== '' && !passengerError

  const hasValidInputs = parsedDistance > 0 && hasValidPassengers

  const result = useMemo(() => (
    hasValidInputs
      ? calculateTrip({
          fuelPrice,
          consumption: parsedConsumption,
          distance: parsedDistance,
          toll: effectiveToll,
          passengers: parsedPassengers,
          isReturn: false,
        })
      : null
  ), [hasValidInputs, fuelPrice, parsedConsumption, parsedDistance, effectiveToll, parsedPassengers])

  useEffect(() => {
    onResultChange?.(result)
  }, [onResultChange, result])

  useEffect(() => {
    fetch('https://api.data.gov.my/data-catalogue/?id=fuelprice&limit=1&sort=-date')
      .then(r => r.json())
      .then(data => {
        const row = data[0]
        if (!row) return
        if (row.ron95_budi95) setBudi95Price(row.ron95_budi95)
        if (row.ron97) setMarketPrice(row.ron97)
        if (row.date) setPriceDate(row.date)
      })
      .catch(() => {})
  }, [])

  function handleCalculate() {
    if (result) {
      setTimeout(() => resultTargetRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      <Section label="Trip details">
        <div className="space-y-1">
          <CarTypeSelector value={carType} onChange={setCarType} />
          <Divider />
          <FuelPriceRow
            budi95Price={budi95Price}
            marketPrice={marketPrice}
            useMarketRate={useMarketRate}
            setUseMarketRate={setUseMarketRate}
            priceDate={priceDate}
          />
          <Divider />
          <PlacesDistanceField
            value={distance}
            onChange={setDistance}
            onRouteResolved={routeLegs => {
              const found = lookupToll(routeLegs)
              setAutoToll(found ? found.toll : null)
              setAutoTollLabel(found ? found.label : null)
              setTollOverridden(false)
            }}
          />
          <Divider />
          <TollSection
            hasToll={hasToll}
            setHasToll={setHasToll}
            autoToll={autoToll}
            autoTollLabel={autoTollLabel}
            tollOverridden={tollOverridden}
            setTollOverridden={setTollOverridden}
            toll={toll}
            setToll={setToll}
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
              <p className="text-xs text-slate-500 dark:text-neutral-400">Including the driver</p>
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
        className="mt-auto w-full py-3.5 rounded-xl font-semibold text-sm transition-all
          bg-blue-600 hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 text-white
          disabled:bg-white disabled:text-slate-400 disabled:border disabled:border-slate-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500 dark:disabled:border-transparent disabled:cursor-not-allowed"
      >
        {hasValidInputs ? 'Calculate →' : 'Fill in your trip details'}
      </button>
    </div>
  )
}

function CarTypeSelector({ value, onChange }) {
  return (
    <div className="py-1 space-y-2">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Car Type</p>
        <p className="text-xs text-slate-600 dark:text-neutral-400">Affects fuel consumption estimate</p>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {Object.entries(CAR_PRESETS).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`py-2 rounded-lg text-xs font-semibold transition-colors ${
              value === key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

function PlacesDistanceField({ value, onChange, onRouteResolved }) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  if (!key) {
    return (
      <Field
        label="Distance"
        required
        description={<>Enter total distance. Double it<br />for return trips.</>}
        unit="km"
        value={value}
        onChange={onChange}
        placeholder="30"
        step="1"
      />
    )
  }

  return <PlacesFields onChange={onChange} onRouteResolved={onRouteResolved} />
}

function PlacesFields({ onChange, onRouteResolved }) {
  const [fromLoc, setFromLoc] = useState(null)
  const [toLoc, setToLoc] = useState(null)
  const [resolvedKm, setResolvedKm] = useState(null)
  const [isReturn, setIsReturn] = useState(false)
  const onChangeRef = useRef(onChange)
  const fromRef = useRef(null)
  const toRef = useRef(null)

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    if (!fromLoc || !toLoc) return
    computeRoute(fromLoc, toLoc)
      .then(({ distanceKm, routeLegs }) => {
        setResolvedKm(distanceKm)
        onChangeRef.current(String(isReturn ? distanceKm * 2 : distanceKm))
        onRouteResolved?.(routeLegs)
      })
      .catch(() => {
        setResolvedKm(null)
        onChangeRef.current('')
        onRouteResolved?.(null)
      })
  }, [fromLoc, toLoc])

  useEffect(() => {
    if (!resolvedKm) return
    onChangeRef.current(String(isReturn ? resolvedKm * 2 : resolvedKm))
  }, [isReturn])

  function clearRoute() {
    setResolvedKm(null)
    onChangeRef.current('')
    onRouteResolved?.(null)
  }

  function swap() {
    const prevFrom = fromLoc
    const prevTo = toLoc
    setFromLoc(prevTo)
    setToLoc(prevFrom)
    // swap the displayed text in both inputs without triggering new searches
    const fromText = toRef.current?.getText?.() ?? ''
    const toText = fromRef.current?.getText?.() ?? ''
    fromRef.current?.setText(fromText)
    toRef.current?.setText(toText)
    if (prevFrom && prevTo) clearRoute()
  }

  const displayKm = resolvedKm ? (isReturn ? resolvedKm * 2 : resolvedKm) : null

  return (
    <div className="py-1 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Distance
            {!resolvedKm && <span className="ml-1 text-red-500 dark:text-red-400">*</span>}
          </p>
          <p className="text-xs text-slate-600 dark:text-neutral-400">
            {displayKm ? `${displayKm} km${isReturn ? ' return' : ' driving'}` : 'Select from and to in Malaysia'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsReturn(r => !r)}
          className={`shrink-0 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
            isReturn
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-transparent text-slate-600 border-slate-200 dark:text-neutral-400 dark:border-white/10'
          }`}
        >
          Return
        </button>
      </div>
      <div className="space-y-1.5">
        <PlacesInput
          placeholder="From"
          onSelect={loc => { setFromLoc(loc); if (toLoc) clearRoute() }}
          onClear={() => { setFromLoc(null); clearRoute() }}
          imperativeRef={fromRef}
        />
        <PlacesInput
          placeholder="To"
          onSelect={loc => { setToLoc(loc); if (fromLoc) clearRoute() }}
          onClear={() => { setToLoc(null); clearRoute() }}
          onSwap={swap}
          imperativeRef={toRef}
        />
      </div>
    </div>
  )
}

function FuelPriceRow({ budi95Price, marketPrice, useMarketRate, setUseMarketRate, priceDate }) {
  const formattedDate = priceDate
    ? new Date(priceDate).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Fuel Price</p>
        <p className="text-xs text-slate-600 dark:text-neutral-400">
          {formattedDate ? `Updated ${formattedDate}` : 'Subsidised rate'}
        </p>
      </div>
      {marketPrice !== null ? (
        <div className="flex shrink-0 rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden text-xs font-semibold">
          <button
            type="button"
            onClick={() => setUseMarketRate(false)}
            className={`px-2.5 py-2 transition-colors ${
              !useMarketRate
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700'
            }`}
          >
            BUDI95 · RM{budi95Price.toFixed(2)}
          </button>
          <button
            type="button"
            onClick={() => setUseMarketRate(true)}
            className={`px-2.5 py-2 transition-colors border-l border-slate-200 dark:border-white/5 ${
              useMarketRate
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700'
            }`}
          >
            RON 97 · RM{marketPrice.toFixed(2)}
          </button>
        </div>
      ) : (
        <span className="text-sm font-semibold text-slate-600 dark:text-white shrink-0">
          RM{budi95Price.toFixed(2)}
        </span>
      )}
    </div>
  )
}

function TollSection({ hasToll, setHasToll, autoToll, autoTollLabel, tollOverridden, setTollOverridden, toll, setToll }) {
  return (
    <div className="py-1 space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Toll</p>
          <p className="text-xs text-slate-600 dark:text-neutral-400">Double it for return trips.</p>
        </div>
        <div className="flex shrink-0 rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden text-xs font-semibold">
          <button
            type="button"
            onClick={() => setHasToll(false)}
            className={`px-3 py-2 transition-colors ${
              !hasToll
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700'
            }`}
          >
            No Toll
          </button>
          <button
            type="button"
            onClick={() => setHasToll(true)}
            className={`px-3 py-2 transition-colors border-l border-slate-200 dark:border-white/5 ${
              hasToll
                ? 'bg-blue-600 text-white'
                : 'bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-700'
            }`}
          >
            Toll
          </button>
        </div>
      </div>

      {hasToll && (
        <div className="space-y-1.5">
          {autoToll !== null && !tollOverridden ? (
            <div className="flex items-center gap-2 ml-auto justify-end">
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-neutral-400">{autoTollLabel}</p>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white shrink-0">RM {autoToll.toFixed(2)}</span>
              <button
                type="button"
                onClick={() => {
                  setToll(String(autoToll))
                  setTollOverridden(true)
                }}
                className="text-xs text-blue-600 dark:text-blue-400 underline underline-offset-2 shrink-0"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-auto justify-end">
              {autoToll === null ? (
                <p className="text-xs text-slate-500 dark:text-neutral-400">No data for this route</p>
              ) : (
                <button
                  type="button"
                  onClick={() => setTollOverridden(false)}
                  className="text-xs text-blue-600 dark:text-blue-400 underline underline-offset-2"
                >
                  Auto Detect
                </button>
              )}
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.10"
                aria-label="Toll amount in RM"
                value={toll}
                onChange={e => setToll(e.target.value)}
                placeholder="0.00"
                className="w-24 appearance-none text-center bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-white/5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 dark:text-white placeholder:text-center placeholder:font-normal placeholder:text-slate-400 dark:placeholder:text-neutral-600 shadow-sm shadow-slate-200/60 dark:shadow-none focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
              <span className="text-xs text-center text-slate-600 dark:text-neutral-600 w-8">RM</span>
            </div>
          )}
        </div>
      )}
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

function Field({ label, required, optional, description, unit, onUnitClick, value, onChange, placeholder, step }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
          {label}
          {required && value === '' && <span className="text-red-500 dark:text-red-400">*</span>}
          {optional && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-400 dark:text-neutral-500">Optional</span>}
        </p>
        <p className="text-xs text-slate-600 dark:text-neutral-400">{description}</p>
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
          <span className="text-xs text-center text-slate-600 dark:text-neutral-600 w-16">{unit}</span>
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
