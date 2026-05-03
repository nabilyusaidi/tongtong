# TongTong

> Nanti kita tongtong tau. · Go Dutch · Chip In · AA · 除

A lightweight, client-side car ride cost calculator for Malaysian drivers and passengers. Split fuel and toll costs fairly. No accounts, no backend, no friction.

**Live:** https://tongtong-alpha.vercel.app

---

## What it does

Enter your fuel price, fuel consumption, trip distance, and toll. TongTong calculates exactly how much each person chips in.

- Supports km/L and L/100km fuel consumption units
- Dark mode with system preference detection
- Fully offline-capable. No network requests.

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
│   │   ├── Explanation.jsx
│   │   ├── Guide.jsx
│   │   ├── PassengerChips.jsx
│   │   └── ResultCard.jsx
│   ├── lib/
│   │   └── calculator.js
│   ├── App.jsx
│   └── main.jsx
└── docs/
    └── architecture.md
```

---

## Deployment

Deployed on Vercel.

---

## Future improvements

- Automated weekly fuel price updates (currently hardcoded in the explanation section)

---

## License

MIT
