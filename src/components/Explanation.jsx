export default function Explanation() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200 dark:border-white/5" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-500 whitespace-nowrap">How it works</p>
        <div className="flex-1 border-t border-slate-200 dark:border-white/5" />
      </div>
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 space-y-3 shadow-md shadow-slate-300/50 dark:shadow-none">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Fuel cost</p>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            price per litre × (distance ÷ km/L)
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-500">
            e.g. RM1.99 × (50 km ÷ 13.3 km/L) = RM7.48
          </p>
        </div>
        <div className="border-t border-slate-100 dark:border-white/5" />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Per person</p>
          <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            (fuel cost + toll) ÷ number of passengers
          </p>
          <p className="text-xs text-slate-500 dark:text-neutral-500">
            e.g. (RM7.48 + RM0 toll) ÷ 4 = RM1.87 each
          </p>
        </div>
      </div>
    </div>
  )
}
