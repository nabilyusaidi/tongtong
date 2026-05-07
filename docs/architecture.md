# Architecture — TongTong

---

## §1 — Overview

TongTong is a static, client-side web application. It calculates how much each passenger in a car ride owes for fuel and toll costs. There is no server, no database, and no user accounts. The entire product is a React app compiled to static HTML, CSS, and JS files, hosted on Vercel.

**Users:** Malaysian drivers and passengers splitting ride costs.
**Replaces:** Mental math, WhatsApp back-and-forth, generic spreadsheets.

---

## §2 — Stack

| Concern | Choice | Rationale |
|---|---|---|
| Framework | Vite + React | No SSR needed. Static calculator. |
| Language | JavaScript | No type complexity that justifies TS overhead. |
| UI components | Tailwind CSS | No component library justified for this scope. |
| Backend | None | Pure client-side. No data to persist. |
| Auth | None | No accounts. |
| ORM | None | No database. |

---

## §3 — Constraints

| Constraint | Rule |
|---|---|
| No backend | Zero server-side code. No API routes. No database. |
| No auth | No accounts, no login, no sessions. Ever. |
| No component libraries | Plain Tailwind CSS only. |
| Mobile-first | Must work on a 375px viewport in a moving car. |
| Zero config deploy | Must deploy to Vercel with no custom build configuration. |

---

## §4 — External APIs

| API | Purpose | Fallback |
|---|---|---|
| Google Places API (v1) | Location autocomplete restricted to Malaysia | Manual distance text input |
| Google Routes API (v2) | Driving distance + navigation steps for toll detection | Manual distance text input |
| data.gov.my (OpenDOSM) | Live weekly RON95 BUDI and RON97 fuel prices | Hardcoded defaults (RM1.99 / RM4.90) |

All API calls are made directly from the browser. The Google Maps API key is restricted to the production domain via HTTP referrer in Google Cloud Console.

---

## §5 — Data flow

```
User selects From / To
        │
        ▼
Google Places API → location coordinates
        │
        ▼
Google Routes API → driving distance (km) + navigation steps
        │                │
        │                ▼
        │        src/lib/tolls.js
        │        lookupToll(routeLegs)
        │        → matched corridor + one-way toll
        │                │
        ▼                ▼
React state (distance, toll, fuelPrice, consumption, passengers, isReturn)
        │
        ▼
src/lib/calculator.js (pure functions)
  calculateTrip({ fuelPrice, consumption, distance, toll, passengers, isReturn })
  → { fuelCost, tollCost, totalCost, perPerson }
        │
        ▼
ResultCard — per-person amount + breakdown
```

Fuel price is fetched once on mount from data.gov.my and stored in component state. No persistence, no caching.

---

## §6 — Toll detection

The Routes API returns navigation steps, each with a Malay instruction string and a maneuver type. `src/lib/tolls.js` matches known highway name substrings against each step individually, filtering out signpost-only references (steps with maneuver `RAMP_*` or instruction text containing `papan tanda` / `ke arah`).

Two categories:
- **Open tolls** (`CORRIDORS`) — fixed fare, auto-filled. Covers LDP, SPRINT, KESAS, DUKE, Federal Hwy, SMART, NPE, Cheras-Kajang, SILK, Karak/Genting, Penang Bridge, Sungai Besi.
- **Closed tolls** (`CLOSED_TOLL_HIGHWAYS`) — distance-based fare, user prompted to enter manually. Covers PLUS (N/S), ELITE, LPT, SDE, BKE.

See [tolls.md](tolls.md) for the full supported corridor list and known limitations.

---

## §7 — File structure

```
tongtong/
├── docs/
│   ├── architecture.md
│   └── tolls.md
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Calculator.jsx     — main form: car type, fuel price, distance, toll, passengers
│   │   ├── PlacesInput.jsx    — autocomplete input with keyboard navigation
│   │   ├── ResultCard.jsx     — cost breakdown output
│   │   ├── PassengerChips.jsx — passenger count selector
│   │   ├── Explanation.jsx    — how-it-works copy
│   │   └── Guide.jsx          — usage guide copy
│   ├── lib/
│   │   ├── calculator.js      — pure cost calculation functions
│   │   ├── maps.js            — Google Routes API call
│   │   ├── places.js          — Google Places API calls
│   │   └── tolls.js           — toll corridor definitions + detection logic
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── README.md
├── index.html
└── vite.config.js
```
