"use client";

import { useCallback, useEffect, useState } from "react";
import { useSound } from "./SoundProvider";

const BOOT_LINES = [
  "> INITIALIZING PORTFOLIO_OS v4.0 …",
  "> loading modules: react ✓  typescript ✓  node ✓",
  "> mounting sectors: MAIN · MISSIONS · LOADOUT · COMMS ✓",
  "> operative: YOAV_HEVRONI // FULL-STACK",
  "> clearance: OPEN TO WORK",
  "> system ready.",
];

const KEY = "boot-seen";

/**
 * One-time-per-session boot overlay. Types out a fake boot log, then waits for
 * ENTER / click — that gesture doubles as the Web Audio unlock (plays a SFX,
 * which resumes the AudioContext). Skipped for the rest of the session via
 * sessionStorage. Renders null on the server so there's no hydration mismatch.
 */
export default function BootIntro() {
  const { play } = useSound();
  const [show, setShow] = useState(false);
  const [typed, setTyped] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  // decide once, client-side, whether this session already saw the boot
  useEffect(() => {
    if (sessionStorage.getItem(KEY) !== "1") setShow(true);
  }, []);

  // type-out sequence (skipped for reduced-motion → shown instantly)
  useEffect(() => {
    if (!show) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setTyped(BOOT_LINES);
      setDone(true);
      return;
    }
    let line = 0;
    let ch = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (line >= BOOT_LINES.length) {
        setDone(true);
        return;
      }
      const full = BOOT_LINES[line];
      ch += 1;
      setTyped((prev) => {
        const next = [...prev];
        next[line] = full.slice(0, ch);
        return next;
      });
      if (ch >= full.length) {
        line += 1;
        ch = 0;
        timer = setTimeout(step, 180);
      } else {
        timer = setTimeout(step, 14);
      }
    };
    timer = setTimeout(step, 260);
    return () => clearTimeout(timer);
  }, [show]);

  const dismiss = useCallback(() => {
    sessionStorage.setItem(KEY, "1");
    play("deploy"); // audio-unlock gesture + feedback
    setShow(false);
  }, [play]);

  // ENTER / SPACE to continue once the log finishes
  useEffect(() => {
    if (!show || !done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, done, dismiss]);

  if (!show) return null;

  return (
    <div
      onClick={done ? dismiss : undefined}
      role="dialog"
      aria-label="boot sequence"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07090d] px-6"
    >
      <div className="w-full max-w-[560px] font-mono text-[13px] leading-[1.9]">
        {typed.map((l, i) => (
          <div key={i} className="text-green">
            {l}
            {!done && i === typed.length - 1 && (
              <span className="ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] animate-blinkdot bg-green" />
            )}
          </div>
        ))}
      </div>
      {done && (
        <button
          className="mt-9 border border-gold px-6 py-2.5 font-mono text-[12px] font-bold tracking-wide3 text-gold hover:brightness-110"
        >
          ▶ PRESS ENTER TO CONTINUE
          <span className="ml-1 inline-block h-[12px] w-[7px] translate-y-[1px] animate-blinkdot bg-gold" />
        </button>
      )}
    </div>
  );
}
