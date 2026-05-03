/**
 * @param {{ result: { perPerson: number, fuelCost: number, tollCost: number, totalCost: number } }} props
 */
export default function ResultCard({ result }) {
  const { perPerson, fuelCost, tollCost, totalCost } = result

  return (
    <div className="rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-1">Each person pays</p>
        <p className="text-5xl font-bold tracking-tight">
          RM {perPerson.toFixed(2)}
        </p>
      </div>

      <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Fuel</span>
          <span>RM {fuelCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Toll</span>
          <span>RM {tollCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-medium border-t border-gray-100 pt-2">
          <span>Total</span>
          <span>RM {totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}
