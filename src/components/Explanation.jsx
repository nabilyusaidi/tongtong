const faqs = [
  {
    q: (
      <>
        <sup>1</sup> What fuel price should I enter?
      </>
    ),
    a: (
      <>
        <strong className="dark:text-white">From 30 April 2026 to 6 May 2026:</strong>
        <br />
        <span className="block">
          <span className="inline-grid grid-cols-[3.25rem_auto_1fr] gap-x-1">
            <span>RON95</span>
            <span>:</span>
            <span>RM3.97/L AND RM1.99/L (BUDI95)</span>
          </span>
        </span>
        <span className="block">
          <span className="inline-grid grid-cols-[3.25rem_auto_1fr] gap-x-1">
            <span>RON97</span>
            <span>:</span>
            <span>RM4.90/L</span>
          </span>
        </span>
        <span className="block">
          <span className="inline-grid grid-cols-[3.25rem_auto_1fr] gap-x-1">
            <span>Diesel</span>
            <span>:</span>
            <span>RM5.12/L in Peninsular Malaysia, RM 2.15/L for East Malaysia</span>
          </span>
        </span>
        <a
          href="https://ringgitplus.com/en/blog/personal-finance-news/petrol-price-malaysia-live-updates-ron95-ron97-diesel.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 text-xs font-medium text-slate-400 dark:text-neutral-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          Source: RinggitPlus
        </a>
      </>
    ),
  },
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
  {
    q: 'What is the difference between L/100km and km/L?',
    a: "km/L is kilometres per litre, so higher means more efficient. L/100km is how many litres your car burns per 100 km, so lower means more efficient. TongTong converts automatically when you tap the unit.",
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
