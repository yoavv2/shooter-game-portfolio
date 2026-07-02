# Shooter Game Portfolio — Yoav Hevroni

Game-HUD themed portfolio. Next.js 14 (App Router) + TypeScript + Tailwind.
Recreated from the Claude Design handoff in `game-shooter-portfolio-design/`.

## Screens (nav)

| Route       | Screen  | Source concept                         |
| ----------- | ------- | -------------------------------------- |
| `/`         | MAIN    | 1a Lobby — missions / operator / deploy |
| `/missions` | MISSIONS| 1c map-select mission grid              |
| `/loadout`  | LOADOUT | 1b skills inventory + item inspect      |
| `/comms`    | COMMS   | 1c briefing hero + contact channels     |

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static prerender, all routes ○ (Static)
```

## Add your assets

- **Photo** — drop an image in `public/` (e.g. `public/me.png`), then pass
  `src="/me.png"` to the `<PhotoSlot>` calls in `app/page.tsx`,
  `app/loadout/page.tsx`, `app/comms/page.tsx`. Until then the design's
  "drop your photo" placeholder shows.
- **CV** — put `public/cv.pdf`. The `CV ↓` links already point at `/cv.pdf`.
- **Project screenshots** — the hatch placeholders in the mission cards; wire
  real images the same way as the photo.

## Edit content

All copy lives in `lib/data.ts` — profile, missions, skills, stats, links
(GitHub / LinkedIn URLs are placeholders there).

## Theme

HUD colors + fonts (Chakra Petch / JetBrains Mono via `next/font`) are in
`tailwind.config.ts` and `app/globals.css`.
