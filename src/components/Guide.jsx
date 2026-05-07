const steps = [
  {
    n: 1,
    title: 'Car & fuel',
    body: "Pick your car type. Fuel price is updated weekly.",
  },
  {
    n: 2,
    title: 'Trip details',
    body: "Enter your From and To distance fills in automatically. Add toll if there is one.",
  },
  {
    n: 3,
    title: 'Passengers',
    body: "Count everyone in the car, including the driver.",
  },
  {
    n: 4,
    title: 'Calculate',
    body: "See each person's fair share instantly.",
  },
]

export default function Guide() {
  return (
    <div className="h-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-4 shadow-md shadow-slate-300/50 dark:shadow-none">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-500">How to use</p>
      <ol className="space-y-4">
        {steps.map(({ n, title, body }) => (
          <li key={n} className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-400/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
              {n}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
              <p className="text-xs text-slate-600 dark:text-neutral-400 mt-0.5 leading-relaxed">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
