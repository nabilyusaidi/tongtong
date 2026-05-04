const faqs = [
  {
    q: 'How is fuel cost calculated?',
    a: (
      <>
        <strong className="dark:text-white">km/L</strong>
        <br />
        fuel cost = price per litre × (distance DIVIDED BY km/L)
        <br />
        Example: RM 1.99 × (50 km DIVIDED BY 12.5) = RM 7.96.
        <br />
        <br />
        <strong className="dark:text-white">L/100km</strong>
        <br />
        fuel cost = price per litre × (L/100km DIVIDED BY 100) × distance
        <br />
        Example: RM 1.99 × (8 DIVIDED BY 100) × 50 km = RM 7.96.
      </>
    ),
  },
  {
    q: "How is each person's share calculated?",
    a: (
      <>
        Cost per Person = (fuel cost + toll) divided by Number of Passengers
        <br />
        Example: (RM 20 fuel cost + RM 5 toll) split by 5 people costs RM 5 per passenger.
      </>
    ),
  },
]

export default function Explanation() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-slate-200 dark:border-white/5" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-neutral-500 whitespace-nowrap">How it works</p>
        <div className="flex-1 border-t border-slate-200 dark:border-white/5" />
      </div>
      <div className="space-y-2">
        {faqs.map(({ q, a }, index) => (
          <div key={index} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-4 space-y-1 shadow-md shadow-slate-300/50 dark:shadow-none">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{q}</p>
            <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">{a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
