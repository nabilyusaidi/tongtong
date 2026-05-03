/**
 * @param {{ result: { perPerson: number }, passengers: number }} props
 */
export default function PassengerChips({ result, passengers }) {
  const { perPerson } = result

  return (
    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-3 shadow-md shadow-slate-300/50 dark:shadow-none">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-500">Breakdown</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: passengers }, (_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center rounded-xl px-4 py-3 text-sm flex-1 min-w-[72px] ${
              i === 0
                ? 'bg-blue-100/60 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/20'
                : 'bg-slate-100/60 dark:bg-neutral-800 border border-slate-200 dark:border-white/5'
            }`}
          >
            <span className={`text-xs font-medium mb-1 ${i === 0 ? 'text-blue-500 dark:text-blue-400' : 'text-slate-600 dark:text-neutral-500'}`}>
              {i === 0 ? 'Driver' : `Pax ${i}`}
            </span>
            <span className={`font-bold ${i === 0 ? 'text-blue-700 dark:text-blue-200' : 'text-slate-900 dark:text-white'}`}>
              RM {perPerson.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
