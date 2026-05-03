/**
 * @param {{ result: { perPerson: number, fuelCost: number, tollCost: number, totalCost: number } }} props
 */
export default function ResultCard({ result }) {
  const { perPerson, fuelCost, tollCost, totalCost } = result

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-md shadow-slate-300/50 dark:shadow-none">
      <div className="bg-blue-50 dark:bg-blue-500/10 border-b border-blue-100 dark:border-white/5 px-5 py-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">Each person pays</p>
        <p className="text-5xl font-black tracking-tight text-blue-700 dark:text-blue-200">RM {perPerson.toFixed(2)}</p>
      </div>

      <div className="px-5 py-4 space-y-3 text-sm">
        <Row label="Fuel" value={`RM ${fuelCost.toFixed(2)}`} />
        <Row label="Toll" value={`RM ${tollCost.toFixed(2)}`} />
        <div className="border-t border-slate-100 dark:border-white/5 pt-3">
          <Row label="Total" value={`RM ${totalCost.toFixed(2)}`} bold />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-neutral-400'}`}>
      <span>{label}</span>
      <span className={bold ? '' : 'text-slate-700 dark:text-neutral-300'}>{value}</span>
    </div>
  )
}
