# TongTong

> Go Dutch · Chip In · 制吧

A lightweight, client-side car ride cost calculator for Malaysian drivers and passengers. Split fuel and toll costs fairly — no accounts, no backend, no friction.

---

## What it does

Enter your fuel price, fuel consumption, trip distance, and toll. TongTong calculates exactly how much each person chips in.

Supports one-way and two-way (return) trips.

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
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

---

## Project structure

```
tongtong/
├── docs/
│   ├── architecture.md   # Single source of truth
│   └── features.md       # Feature list and status
├── src/
│   ├── components/       # React components
│   ├── lib/              # Pure calculation logic
│   └── main.jsx          # Entry point
├── CHANGELOG.md
└── README.md
```

---

## Deployment

Connected to Vercel via GitHub. Every push to `main` triggers a production deploy automatically.

---

## License

MIT