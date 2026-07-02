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

Profile, skills, stats and links live in `lib/data.ts`
(GitHub / LinkedIn URLs are placeholders there).

## Projects (missions)

Each project is one markdown file in `content/missions/`. The filename is the
URL slug (`gaphunter.md` → `/missions/gaphunter`). Frontmatter drives the
cards; the markdown body is the intel page shown when a card is clicked —
so a project shows even when it isn't deployed anywhere.

```markdown
---
name: My Project            # display name
rarity: LEGENDARY           # LEGENDARY | EPIC | RARE
blurb: One-line description shown on cards
progress: 100               # 0–100 progress bar
order: 1                    # sort position in the grid
stack: [Next.js, Supabase]  # tech chips
liveUrl: https://…          # optional — shows a DEPLOY button
repoUrl: https://github.com/… # optional — shows a SOURCE button
---

## OBJECTIVE

Free-form markdown — headings, lists, links, code, images.
```

- **Add a project** — create a new `.md` file there. It appears everywhere
  automatically (lobby, mission grid, terminal, detail page).
- **Edit / remove** — edit or delete the file.
- No `liveUrl`? The detail page shows "OFFLINE — INTEL ONLY" instead of DEPLOY.

## Theme

HUD colors + fonts (Chakra Petch / JetBrains Mono via `next/font`) are in
`tailwind.config.ts` and `app/globals.css`.
