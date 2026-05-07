# TongTong

> Nanti kita tongtong tau. · Go Dutch · Chip In · 我们AA lah · 我们除 lah

A lightweight, client-side car ride cost calculator for Malaysian drivers and passengers. Split fuel and toll costs fairly. No accounts, no backend, no friction.

**Live:** https://tongtong-alpha.vercel.app

---

## What it does

Enter your trip details and TongTong calculates exactly how much each person chips in for fuel and toll.

- **Car type presets** — choose Hatchback, Sedan, SUV, or MPV. Each has a typical L/100km consumption value used for the fuel cost estimate (6.5 / 7.5 / 9.5 / 11.0)
- **Live fuel price** — fetched on load from [data.gov.my](https://data.gov.my) (OpenDOSM). Defaults to BUDI RON95 subsidised rate; toggle to unsubsidised market rate
- **Distance autocomplete** — [Google Places API](https://developers.google.com/maps/documentation/places/web-service) for location search restricted to Malaysia, then [Google Routes API](https://developers.google.com/maps/documentation/routes) (DRIVE mode) for the actual driving distance
- **Toll auto-detection** — reads highway names from the Routes API response to identify which toll roads you'll use and fills in the fare automatically — see [docs/tolls.md](docs/tolls.md)
- **Return trip** — toggle doubles both distance and toll
- Fully client-side. No backend, no accounts, no data stored

---

## Stack

| Concern | Choice |
|---|---|
| Framework | Vite + React |
| Language | JavaScript |
| Styling | Tailwind CSS |
| Package manager | pnpm |
| Hosting | Vercel |
| Version control | GitHub |

---

## Getting started

```bash
pnpm install
pnpm dev
```

---

## Project structure

```
tongtong/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Calculator.jsx
│   │   └── PlacesInput.jsx
│   ├── lib/
│   │   ├── calculator.js
│   │   ├── maps.js
│   │   ├── places.js
│   │   └── tolls.js
│   ├── App.jsx
│   └── main.jsx
└── docs/
    ├── architecture.md
    └── tolls.md
```

---

## Deployment

Deployed on Vercel.

---

## Future improvements

- Automated weekly fuel price updates
- EV Support

---

## License

MIT
