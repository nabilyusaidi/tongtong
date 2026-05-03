/**
 * @param {{ result: { perPerson: number }, passengers: number }} props
 */
export default function PassengerChips({ result, passengers }) {
  const { perPerson } = result

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: passengers }, (_, i) => (
        <div
          key={i}
          className="flex flex-col items-center border border-gray-200 rounded-lg px-4 py-2 text-sm"
        >
          <span className="text-gray-500 text-xs">{i === 0 ? 'Driver' : `Passenger ${i}`}</span>
          <span className="font-semibold">RM {perPerson.toFixed(2)}</span>
        </div>
      ))}
    </div>
  )
}
