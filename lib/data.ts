export type Rarity = "LEGENDARY" | "EPIC" | "RARE";

export const rarityColor: Record<Rarity, string> = {
  LEGENDARY: "#c9962a",
  EPIC: "#a86ee0",
  RARE: "#4da3ff",
};

// tailwind class fragments per rarity, for tinted chip backgrounds / borders
export const rarityChip: Record<
  Rarity,
  { text: string; border: string; bg: string; short: string }
> = {
  LEGENDARY: {
    text: "text-[#e7b93c]",
    border: "border-[#4d3d14]",
    bg: "bg-[rgba(77,61,20,0.25)]",
    short: "LGD",
  },
  EPIC: {
    text: "text-[#b58ae0]",
    border: "border-[#3d2a52]",
    bg: "bg-[rgba(61,42,82,0.25)]",
    short: "EPC",
  },
  RARE: {
    text: "text-[#6fb4ff]",
    border: "border-[#1d3a5c]",
    bg: "bg-[rgba(29,58,92,0.25)]",
    short: "RAR",
  },
};

export const profile = {
  name: "Yoav_Hevroni",
  displayName: "YOAV HEVRONI",
  role: "FULL-STACK OPERATIVE · FRONTEND CLASS",
  base: "Tel Aviv",
  years: "4+",
  status: "OPEN TO WORK",
  phone: "+972 52 870 1646",
  email: "YoavHevroni1@gmail.com",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/",
  cv: "/cv.pdf",
  briefing: [
    "Builds production web apps end-to-end — React, TypeScript, Node.",
    "Turns product requirements into maintainable systems & polished UX.",
    "AI-assisted workflows across planning, implementation & testing.",
    "Base: Tel Aviv · 4+ yrs in the field.",
  ],
};

export const stats = [
  { label: "FRONTEND", tag: "UI", value: "95", color: "#f2c41d", border: "#4d3d14", bg: "rgba(77,61,20,0.2)" },
  { label: "BACKEND", tag: "API", value: "88", color: "#a3d514", border: "#3d5214", bg: "rgba(61,82,20,0.2)" },
  { label: "AI-DEV", tag: "AI", value: "100", color: "#3b9dff", border: "#1d3a5c", bg: "rgba(29,58,92,0.2)" },
];

// Mission data itself lives in content/missions/*.md (one markdown file per
// project) — loaded server-side by lib/missions.ts. Only the type stays here
// so client components can import it without pulling in fs.
export type Mission = {
  slug: string;
  name: string;
  rarity: Rarity;
  blurb: string;
  progress: number;
  stack: string[];
  order: number;
  liveUrl?: string;
  repoUrl?: string;
};

export type SkillTier = "LGD" | "EPC" | "RAR";

export const tierToRarity: Record<SkillTier, Rarity> = {
  LGD: "LEGENDARY",
  EPC: "EPIC",
  RAR: "RARE",
};

export type SkillItem = {
  name: string;
  tier: SkillTier;
  /** item-card flavor line, e.g. "PRIMARY WEAPON · 4+ YRS" */
  klass: string;
  desc: string;
  stats: { label: string; value: number }[];
  synergy?: string;
};

// NOTE: stat values / copy are Claude-drafted placeholders — user edits real numbers.
export const skillGroups: {
  title: string;
  size: "lg" | "wide";
  items: SkillItem[];
}[] = [
  {
    title: "PRIMARY — FRONTEND",
    size: "lg",
    items: [
      {
        name: "React",
        tier: "LGD",
        klass: "PRIMARY WEAPON · 4+ YRS",
        desc: "Production apps end-to-end: reusable components, real-time flows, polished UX.",
        stats: [
          { label: "UI CRAFT", value: 94 },
          { label: "ARCHITECTURE", value: 88 },
          { label: "SHIP SPEED", value: 96 },
        ],
        synergy: "+AI WORKFLOW · faster planning → shipping",
      },
      {
        name: "TypeScript",
        tier: "LGD",
        klass: "PRIMARY WEAPON · 4+ YRS",
        desc: "Strict types across the stack — fewer runtime surprises, safer refactors, honest APIs.",
        stats: [
          { label: "TYPE SAFETY", value: 95 },
          { label: "REFACTORING", value: 90 },
          { label: "DX", value: 92 },
        ],
        synergy: "+REACT · fully typed component contracts",
      },
      {
        name: "Next.js",
        tier: "EPC",
        klass: "TACTICAL RIFLE · APP ROUTER",
        desc: "App Router, RSC, SSR/ISR — fast pages, clean routing, deploy-ready on Vercel.",
        stats: [
          { label: "PERFORMANCE", value: 90 },
          { label: "SEO", value: 86 },
          { label: "DEPLOYMENT", value: 93 },
        ],
        synergy: "+VERCEL · zero-config ship pipeline",
      },
      {
        name: "Redux",
        tier: "EPC",
        klass: "SIDEARM · STATE CONTROL",
        desc: "Predictable global state for complex apps — RTK, slices, middleware where it earns its keep.",
        stats: [
          { label: "STATE FLOW", value: 85 },
          { label: "DEBUGGING", value: 88 },
        ],
      },
      {
        name: "Tailwind",
        tier: "RAR",
        klass: "UTILITY GEAR · CSS",
        desc: "Utility-first styling — consistent design systems shipped fast, no stylesheet drift.",
        stats: [
          { label: "SPEED", value: 92 },
          { label: "CONSISTENCY", value: 89 },
        ],
      },
      {
        name: "MUI",
        tier: "RAR",
        klass: "UTILITY GEAR · COMPONENTS",
        desc: "Component library for dashboards & internal tools — themed, accessible, quick to stand up.",
        stats: [
          { label: "VELOCITY", value: 87 },
          { label: "THEMING", value: 82 },
        ],
      },
    ],
  },
  {
    title: "SECONDARY — BACKEND",
    size: "lg",
    items: [
      {
        name: "Node.js",
        tier: "EPC",
        klass: "SECONDARY WEAPON · RUNTIME",
        desc: "APIs, services and tooling in JS/TS end-to-end — one language across the stack.",
        stats: [
          { label: "API DESIGN", value: 87 },
          { label: "ASYNC FLOW", value: 89 },
        ],
        synergy: "+TYPESCRIPT · shared types client ↔ server",
      },
      {
        name: "Express",
        tier: "EPC",
        klass: "SECONDARY WEAPON · HTTP",
        desc: "REST APIs, middleware chains, auth — boring, battle-tested plumbing that just works.",
        stats: [
          { label: "ROUTING", value: 88 },
          { label: "MIDDLEWARE", value: 85 },
        ],
      },
      {
        name: "MongoDB",
        tier: "RAR",
        klass: "SUPPLY CRATE · NOSQL",
        desc: "Document modeling, aggregation pipelines, indexes — schema that fits the product.",
        stats: [
          { label: "MODELING", value: 82 },
          { label: "QUERIES", value: 84 },
        ],
      },
      {
        name: "Supabase",
        tier: "RAR",
        klass: "SUPPLY CRATE · BAAS",
        desc: "Postgres + auth + storage + realtime — full backend stood up in an afternoon.",
        stats: [
          { label: "SETUP SPEED", value: 90 },
          { label: "REALTIME", value: 83 },
        ],
      },
      {
        name: "gRPC",
        tier: "RAR",
        klass: "SUPPLY CRATE · RPC",
        desc: "Typed service-to-service contracts with protobuf — fast, strict internal APIs.",
        stats: [
          { label: "CONTRACTS", value: 80 },
          { label: "PERFORMANCE", value: 85 },
        ],
      },
    ],
  },
  {
    title: "CLASS ITEM — AI-ASSISTED DEV",
    size: "wide",
    items: [
      {
        name: "Claude Code",
        tier: "LGD",
        klass: "CLASS ITEM · FORCE MULTIPLIER",
        desc: "AI-assisted planning, implementation and testing — whole features shipped in hours, reviewed line by line.",
        stats: [
          { label: "PLANNING", value: 93 },
          { label: "EXECUTION", value: 95 },
          { label: "REVIEW", value: 90 },
        ],
        synergy: "+EVERYTHING · multiplies the whole loadout",
      },
      {
        name: "GitHub Copilot",
        tier: "EPC",
        klass: "CLASS ITEM · AUTOCOMPLETE",
        desc: "In-editor completions for boilerplate and tests — keeps hands on the keyboard.",
        stats: [
          { label: "FLOW", value: 86 },
          { label: "BOILERPLATE", value: 90 },
        ],
      },
    ],
  },
];

export const gear = ["Git", "Docker", "Vite", "Webpack", "CI/CD"];

export const tierStyle: Record<
  SkillTier,
  { border: string; grad: string; text: string; badge: string }
> = {
  LGD: {
    border: "border-[#8a6a14]",
    grad: "bg-[linear-gradient(160deg,rgba(138,106,20,0.28),rgba(18,22,29,0.9)_70%)]",
    text: "text-[#f0d27a]",
    badge: "text-[#c9962a]",
  },
  EPC: {
    border: "border-[#5c3d7a]",
    grad: "bg-[linear-gradient(160deg,rgba(92,61,122,0.3),rgba(18,22,29,0.9)_70%)]",
    text: "text-[#c9a3ee]",
    badge: "text-[#a86ee0]",
  },
  RAR: {
    border: "border-[#1d3a5c]",
    grad: "bg-[linear-gradient(160deg,rgba(29,58,92,0.3),rgba(18,22,29,0.9)_70%)]",
    text: "text-[#8cc3ff]",
    badge: "text-[#4da3ff]",
  },
};
