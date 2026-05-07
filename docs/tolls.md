# Toll Auto-Detection

TongTong attempts to auto-detect the toll for your route using the Google Routes API. This document explains how it works, what's supported, and what isn't.

---

## How it works

When you enter a From and To location, TongTong calls the Google Routes API and reads the navigation steps for your route. Each step contains an instruction string (in Malay) and a maneuver type. TongTong matches known highway names against these steps to identify which toll roads you'll travel on.

Open tolls (fixed fare) are filled in automatically. Closed tolls (distance-based fare, like PLUS) are detected but you'll be prompted to enter the amount manually.

---

## Supported corridors

### Open tolls — auto-filled

| Corridor | One-way toll |
|---|---|
| LDP (E11) | RM 2.00 |
| SPRINT (E23) | RM 1.50 |
| KESAS (E13) | RM 1.60 |
| DUKE (E33) | RM 2.00 |
| Federal Highway | RM 0.50 |
| SMART Tunnel | RM 2.00 |
| NPE (E10) | RM 1.50 |
| Cheras-Kajang (E7) | RM 1.50 |
| SILK (E18) | RM 1.50 |
| Karak/Genting (E8) | RM 5.70 |
| Penang Bridge (E36) | RM 7.00 |
| Sungai Besi (E9) | RM 1.50 |

### Closed tolls — manual entry required

These highways charge distance-based fares that vary by entry and exit point. TongTong detects them and prompts you to enter the amount from your Touch 'n Go receipt.

| Corridor | Notes |
|---|---|
| PLUS North (E1) | KL → Ipoh / Penang direction |
| PLUS South (E2) | KL → JB direction |
| ELITE (E6) | KL → KLIA / Nilai |
| LPT / East Coast Expressway (E8) | KL → Kuantan |
| Senai-Desaru (E22) | JB → Desaru |
| Butterworth-Kulim (E15) | Butterworth → Kulim |

---

## Known limitations

**AKLEH (E12)** — Google always routes through AKLEH as a ramp-only segment. There is no step where the car is on the highway proper, so it cannot be detected. Falls back to manual entry.

**NKVE** — Google does not route via NKVE for any tested origin/destination pair. Routes that could use NKVE are sent via PLUS North instead.

**MEX (E20), GCE (E35), SUKE (E19), DASH (E31)** — Google consistently routes via alternative highways for all tested origin/destination pairs. These corridors have not appeared in any route log.

**Federal Highway** — Only detectable for routes that spend a meaningful stretch on the highway. Short entry/exit segments (where the maneuver is a ramp) are filtered out to avoid false positives.

**Multi-toll routes** — If your route uses multiple open toll roads, TongTong sums them up and shows a combined label (e.g. "Cheras-Kajang + SILK — RM 3.00").

**Return trips** — Toggle "Return" and TongTong doubles both the distance and toll automatically.

---

## Detection accuracy

Toll detection is best-effort. The Routes API returns highway names in Malay, embedded in freeform instruction text, and the exact strings vary by direction and route. All match strings in TongTong have been verified against real route logs.

If detection is wrong for your route, you can always override the toll amount by clicking **Edit** next to the detected value.
