# Gamification Plan — Shooter Portfolio

> Working doc for making the site more "gamey". If resuming in a fresh session:
> read this file + README.md, check the Status column, continue from the first
> `todo` item. Update this file as phases land.

## Context

- Site: Next.js 14 App Router + TS + Tailwind, 4 static routes
  (`/` lobby, `/missions`, `/loadout`, `/comms`). Built from
  `game-shooter-portfolio-design/` handoff (design ref: variants 1a/1b/1c).
- Content lives in `lib/data.ts`. Shared frame: `components/Shell.tsx` +
  `components/HudBar.tsx`. Photo/CV assets still not provided by user.
- User approved ALL four directions (2026-07-02). Build order below.

## Status

| Phase | Item | Status |
|-------|------|--------|
| 1 | SoundProvider (Web Audio, synthesized SFX, mute in HudBar, localStorage) | done |
| 1 | Crosshair cursor + reticle lock-on hover (CSS, desktop only) | done |
| 1 | Route transitions — glitch/wipe + "LOADING MISSION…" (~400ms, CSS first) | done |
| 1 | Achievement system — context + toast queue + localStorage + HUD counter | done |
| 2 | Loadout: click skill card → inspect panel swaps (React state + per-skill data in lib/data.ts) | done |
| 2 | 3D item inspect — R3F + drei, dynamic(ssr:false), procedural hologram items, rarity rim-light, drag-to-spin | done |
| 3 | Hologram avatar frame — photo texture on plane, scanline shader, particles, mouse parallax (reuse Phase 2 canvas wrapper) | done |
| 4 | Boot intro — one-time terminal type-out overlay, PRESS ENTER (= audio unlock gesture), sessionStorage skip | done |
| 4 | Comms terminal — `help` `cv` `email` `missions` `whoami` + `sudo hire` easter egg → achievement | done |

## Locked decisions

- **SFX**: synthesized via Web Audio API — no audio files, no licensing.
- **3D**: procedural (primitives + wireframe/hologram materials), NO GLTF
  models / asset pipeline. Hologram aesthetic hides low fidelity.
- **Bundle**: three/R3F lazy-loaded (`next/dynamic`, `ssr:false`) only where
  used (`/loadout`, lobby avatar). `/missions` + `/comms` stay three-free.
- **framer-motion**: deferred — CSS keyframes first, add only if needed.
- **Audio autoplay**: no sound before first user gesture; boot intro's
  PRESS ENTER doubles as the unlock.

## Architecture (Phases 1–2 BUILT, rest planned)

Built (Phase 2, verified in browser + prod build 2026-07-02):
- Deps: `three@0.169`, `@react-three/fiber@8`, `@react-three/drei@9`
  (v8/v9 lines — React 18 compatible; R3F v9 needs React 19).
- `lib/data.ts` — `SkillItem` extended with `klass`, `desc`, `stats[]`,
  `synergy?`; `tierToRarity` map. Stat numbers are Claude placeholders,
  user still to edit.
- `components/LoadoutInventory.tsx` — client; center inventory + right
  inspect panel, selection state, cards are `<button>`s (free hover/click
  SFX via GameLayer), `deploy` SFX + INSPECTED_ITEM unlock on inspect,
  panel re-mount uses existing `route-reveal` keyframe.
- `components/three/HoloCanvas.tsx` — shared Canvas wrapper (dpr [1,1.5],
  transparent). Gates on `(pointer:fine)` + not reduced-motion → renders
  static fallback otherwise (mobile degrade).
- `components/three/InspectItem.tsx` — default export composed w/ HoloCanvas,
  loaded via `next/dynamic(ssr:false)` from LoadoutInventory so three stays
  out of first-load JS (loadout 106 kB first load; missions/comms three-free).
  Tier geometry (LGD icosahedron / EPC octahedron / RAR box), wireframe shell
  + translucent core, rarity rim pointlights, drei Float + Sparkles,
  OrbitControls drag-to-spin + idle Y-spin, per-name seeded pose.

Built (Phase 1, verified in browser 2026-07-02):
- `components/game/SoundProvider.tsx` — `useSound()`: `play(blip|click|sting|deploy|deny)`,
  `muted`, `toggleMute`. Synthesized Web Audio. Pref in localStorage `sfx-muted`.
- `components/game/AchievementsProvider.tsx` — `useAchievements()`: `unlock(id)`,
  `unlocked`, `total`; toast stack included. Registry: RECON, KONAMI,
  INSPECTED_ITEM, FOUND_TERMINAL, SUDO_HIRE. localStorage `achievements-v1`.
- `components/game/GameLayer.tsx` — delegated hover/click SFX (`a, button,
  [data-sfx]`), Konami listener, sector-visit tracking (`sectors-visited`) → RECON.
- `app/template.tsx` — route wipe + "LOADING <SECTOR>…" overlay (420ms).
- `app/globals.css` — crosshair/reticle cursors (pointer:fine only), wipe/reveal/
  toast keyframes, prefers-reduced-motion fallbacks.
- HudBar: ★ n/5 counter + SFX ON/OFF button. Providers wired in `app/layout.tsx`.
Built (Phase 3, prod build + typecheck pass 2026-07-02; browser verify pending
— extension not connected this session):
- `components/three/HoloAvatar.tsx` — default export composed w/ HoloCanvas,
  two ShaderMaterial variants: FRAG_PROCEDURAL (head+shoulders silhouette,
  used until photo exists) and FRAG_TEXTURED (samples `uMap`, holo-tints).
  Shared HOLO_FX GLSL: moving scanlines + faint grid + upward scan sweep.
  Pointer parallax (useParallax lerps group rot from `state.pointer`),
  drei Sparkles. HOLO color `#5ab0ff`. Coarse-pointer/reduced-motion →
  StaticAvatarArt fallback (scanline stripe).
- `components/AvatarStage.tsx` — client wrapper; `next/dynamic(ssr:false)`
  import of HoloAvatar (keeps three off lobby first-load — `/` = 100 kB),
  bordered frame + HUD corner brackets. `src?` prop wires `public/me.png`
  when provided; passes through to shader texture path.
- `app/page.tsx` — center PhotoSlot swapped for `<AvatarStage>`. PhotoSlot.tsx
  now unused (kept).
Built (Phase 4, prod build + typecheck pass 2026-07-02; browser verify pending
— extension + playwright unavailable this session, SSR smoke only):
- `components/game/BootIntro.tsx` — mounted in root layout inside providers.
  One-time-per-session boot log (sessionStorage `boot-seen`); renders null on
  server → no hydration flash. Types out BOOT_LINES, then ENTER/SPACE/click
  dismisses and calls `play("deploy")` as the Web Audio unlock gesture.
  z-[100] (over route wipe z-80 + toast z-90). Reduced-motion → shown instantly.
- `components/game/Terminal.tsx` — interactive fake shell on `/comms` (added as
  "DIRECT UPLINK // TERMINAL" section below the two-col hero). Commands
  help/whoami/missions/email/cv/clear, driven off `profile`+`missions`. Opening
  it unlocks FOUND_TERMINAL; `sudo hire` unlocks SUDO_HIRE. ↑/↓ history,
  autoscroll, click-to-focus, whitespace-normalized command match. No three →
  `/comms` first-load stays 106 kB.

## Risks / notes

- Phase 3 shaders = finicky; timebox, fallback = current static PhotoSlot.
- Mobile: 3D + parallax degrade to static; crosshair desktop-only.
- Achievements/XP must never block content — pure garnish.
- Still pending from user: real photo (`public/me.png`), `public/cv.pdf`,
  real GitHub/LinkedIn URLs in `lib/data.ts`.
