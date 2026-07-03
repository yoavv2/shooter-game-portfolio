"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/data";
import { useSound } from "./game/SoundProvider";
import { useAchievements } from "./game/AchievementsProvider";
import { NAV } from "./HudBar";

function Badge({ tag }: { tag: string }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue font-mono text-[10px] font-semibold text-blue">
      {tag}
    </span>
  );
}

/**
 * Mobile-only "TAC MENU". A HUD-styled burger toggles a full-height panel that
 * slides in from the right, housing everything the desktop bar shows inline
 * (nav, socials, CV, SFX, achievements) — none of which is otherwise reachable
 * below `md`. Rendered with `md:hidden`; desktop keeps the inline HudBar.
 */
export default function MobileMenu() {
  const pathname = usePathname();
  const { muted, toggleMute } = useSound();
  const { unlocked, total, openPanel } = useAchievements();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // lock body scroll, Escape to close, auto-close when we hit desktop width
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mq = window.matchMedia("(min-width: 768px)");
    const onDesktop = () => mq.matches && setOpen(false);

    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onDesktop);

    // move focus into the panel
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    burgerRef.current?.focus();
  };

  return (
    <div className="md:hidden">
      <button
        ref={burgerRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="tac-menu"
        aria-label={open ? "close menu" : "open menu"}
        className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] border border-line2"
      >
        <span
          className={`h-[2px] w-5 bg-ink transition-transform ${
            open ? "translate-y-[7px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-[2px] w-5 bg-ink transition-opacity ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`h-[2px] w-5 bg-ink transition-transform ${
            open ? "-translate-y-[7px] -rotate-45" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            aria-hidden="true"
            tabIndex={-1}
            onClick={close}
            className="fixed inset-0 z-40 bg-[rgba(5,7,10,0.72)] backdrop-blur-sm animate-menu-fade"
          />
          <div
            id="tac-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="menu"
            className="hatch fixed right-0 top-0 z-50 flex h-full w-[82vw] max-w-[320px] flex-col border-l-2 border-gold bg-[rgba(9,12,17,0.97)] animate-menu-slide"
          >
            <div className="flex h-[62px] flex-none items-center justify-between border-b border-line2 bg-[rgba(9,12,17,0.9)] px-5">
              <span className="font-mono text-[11px] tracking-hud text-steel">
                TAC MENU
              </span>
              <button
                onClick={() => {
                  setOpen(false);
                  openPanel();
                }}
                aria-label="open medals and hints"
                className="border border-[#39424e] px-2 py-1 font-mono text-[10px] tracking-[0.12em] text-steel"
              >
                ★ {unlocked.length}/{total}
              </button>
            </div>

            <nav className="flex flex-col px-3 py-3">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={`flex items-center gap-3 px-3 py-3.5 text-[19px] font-semibold tracking-wide2 ${
                      active ? "text-gold" : "text-[#9aa4b0]"
                    }`}
                  >
                    <span
                      className={`font-mono text-[15px] ${
                        active ? "text-gold" : "text-transparent"
                      }`}
                    >
                      ⌖
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mx-3 border-t border-line2" />

            <div className="flex flex-col gap-3 px-6 py-4">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[14px] font-medium tracking-[0.1em] text-[#dfe6ee]"
              >
                <Badge tag="G" />
                GITHUB
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[14px] font-medium tracking-[0.1em] text-[#dfe6ee]"
              >
                <Badge tag="in" />
                LINKEDIN
              </a>
            </div>

            <div className="mt-auto flex flex-col gap-3 border-t border-line2 px-6 py-5">
              <a
                href={profile.cv}
                download="Yoav-Hevroni-CV.pdf"
                className="clip-bevel-sm bg-gold py-3 text-center text-[15px] font-bold tracking-wide2 text-[#141105]"
              >
                CV ↓
              </a>
              <button
                onClick={toggleMute}
                aria-label={muted ? "unmute sound" : "mute sound"}
                className={`border px-3 py-2.5 text-center font-mono text-[11px] font-semibold tracking-[0.12em] ${
                  muted ? "border-[#39424e] text-steel" : "border-green text-green"
                }`}
              >
                {muted ? "SFX OFF" : "SFX ON"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
