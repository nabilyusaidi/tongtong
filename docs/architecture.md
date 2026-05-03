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
| Language | JavaScript | Four input fields feeding one formula. No type complexity that justifies TS overhead. |
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
| No external API calls | All computation is pure JS, fully offline-capable. |
| Mobile-first | Must work on a 375px viewport in a moving car. |
| Zero config deploy | Must deploy to Vercel with no custom build configuration. |

---

## §4 — Data flow

```
User input (4 fields + 1 stepper)
        │
        ▼
React state (controlled inputs)
        │
        ▼
src/lib/calculator.js (pure functions)
  - calculateFuelCost(fuelPrice, consumption, distance)
  - calculateTotalCost(fuelCost, toll)
  - calculatePerPerson(totalCost, passengers)
        │
        ▼
Rendered result (per-person amount + breakdown)
```

No network requests. No side effects. No persistence.

---

## §5 — File structure

```
tongtong/
├── docs/
│   └── architecture.md
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Calculator.jsx
│   │   ├── ResultCard.jsx
│   │   └── PassengerChips.jsx
│   ├── lib/
│   │   └── calculator.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── CHANGELOG.md
├── README.md
├── index.html
└── vite.config.js
```
