"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSound } from "./SoundProvider";
import { useAchievements } from "./AchievementsProvider";

const INTERACTIVE = "a, button, [data-sfx]";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const SECTORS = ["/", "/missions", "/loadout", "/comms"] as const;

/**
 * Global game-feel wiring, via event delegation so individual components
 * don't need sound plumbing: hover blip + click SFX on any interactive
 * element, Konami listener, and sector-visit tracking for the RECON badge.
 */
export default function GameLayer() {
  const { play } = useSound();
  const { unlock } = useAchievements();
  const pathname = usePathname();
  const lastHover = useRef<Element | null>(null);
  const konamiPos = useRef(0);

  // hover blip + click clack (delegated)
  useEffect(() => {
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      if (el && el !== lastHover.current) play("blip");
      lastHover.current = el;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) play("click");
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("click", onClick);
    };
  }, [play]);

  // konami
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const expect = KONAMI[konamiPos.current];
      konamiPos.current =
        e.key === expect ? konamiPos.current + 1 : e.key === KONAMI[0] ? 1 : 0;
      if (konamiPos.current === KONAMI.length) {
        konamiPos.current = 0;
        unlock("KONAMI");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unlock]);

  // sector visits → RECON once all four seen
  useEffect(() => {
    if (!(SECTORS as readonly string[]).includes(pathname)) return;
    const KEY = "sectors-visited";
    const seen = new Set<string>(
      JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[],
    );
    seen.add(pathname);
    localStorage.setItem(KEY, JSON.stringify([...seen]));
    if (SECTORS.every((s) => seen.has(s))) unlock("RECON");
  }, [pathname, unlock]);

  return null;
}
