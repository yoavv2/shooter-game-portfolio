import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Mission, Rarity } from "./data";

/**
 * Missions live as markdown files in content/missions/*.md — one file per
 * project. Frontmatter carries the card data (name, rarity, blurb, progress,
 * stack, order, optional liveUrl/repoUrl); the markdown body is the intel
 * page shown at /missions/[slug]. Adding a project = adding a file.
 *
 * Server-only (uses fs) — never import from a "use client" component; pass
 * the parsed missions down as props instead (see Terminal on /comms).
 */

const MISSIONS_DIR = path.join(process.cwd(), "content", "missions");

const RARITIES: Rarity[] = ["LEGENDARY", "EPIC", "RARE"];

export type MissionDetail = Mission & {
  /** markdown body rendered to HTML */
  html: string;
};

function parseFile(file: string): MissionDetail {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(MISSIONS_DIR, file), "utf8");
  const { data, content } = matter(raw);

  const rarity: Rarity = RARITIES.includes(data.rarity) ? data.rarity : "RARE";

  return {
    slug,
    name: data.name ?? slug,
    rarity,
    blurb: data.blurb ?? "",
    progress: typeof data.progress === "number" ? data.progress : 0,
    stack: Array.isArray(data.stack) ? data.stack : [],
    order: typeof data.order === "number" ? data.order : 99,
    liveUrl: data.liveUrl || undefined,
    repoUrl: data.repoUrl || undefined,
    html: marked.parse(content, { async: false }) as string,
  };
}

export function getMissions(): MissionDetail[] {
  return fs
    .readdirSync(MISSIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parseFile)
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
}

export function getMission(slug: string): MissionDetail | null {
  if (!/^[\w-]+$/.test(slug)) return null;
  const file = path.join(MISSIONS_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return parseFile(`${slug}.md`);
}
