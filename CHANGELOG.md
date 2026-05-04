# Changelog

All notable changes to TongTong are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- Car category presets — 4-option grid (Hatchback, Sedan, SUV, MPV); consumption values silently mapped to L/100km, hidden from user
- Live fuel price toggle — fetches RON95 and BUDI95 rates from data.gov.my on load; pill toggle switches between subsidised (RM1.99) and market rate; falls back to RM1.99 if fetch fails
- `calculateTrip()` wrapper in `src/lib/calculator.js` — handles one-way and return trips, returns fuelCost, tollCost, totalCost, perPerson

### Removed
- Fuel consumption text input and L/100km / km/L unit toggle from calculator form
- "L/100km vs km/L" FAQ entry from Explanation.jsx
- Manual fuel price text input from calculator form
- "What fuel price should I enter?" FAQ entry from Explanation.jsx

---

## [0.1.0] — 2026-05-03

### Added
- Vite + React + Tailwind v4 scaffold
- Core file structure (`src/components/`, `src/lib/calculator.js`)
- Deployed to Vercel at https://tongtong-alpha.vercel.app/
