"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/data";
import { useSound } from "./game/SoundProvider";
import { useAchievements } from "./game/AchievementsProvider";
import MobileMenu from "./MobileMenu";

export const NAV = [
  { label: "MAIN", href: "/" },
  { label: "MISSIONS", href: "/missions" },
  { label: "LOADOUT", href: "/loadout" },
  { label: "COMMS", href: "/comms" },
];

function SocialBadge({ tag }: { tag: string }) {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-blue font-mono text-[10px] font-semibold text-blue">
      {tag}
    </span>
  );
}

export default function HudBar() {
  const pathname = usePathname();
  const { muted, toggleMute } = useSound();
  const { unlocked, total } = useAchievements();

  return (
    <header className="flex h-[62px] flex-none items-center justify-between border-b border-line2 bg-[rgba(9,12,17,0.92)] px-4 md:px-[26px]">
      <div className="flex items-center gap-6 md:gap-10">
        <div className="h-[22px] w-[22px] rotate-45 border-2 border-[#3a4450]" />
        <nav className="hidden items-center gap-5 md:flex md:gap-9">
          {NAV.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative py-5 text-[13px] font-medium tracking-hud md:text-[15px] ${
                  active ? "font-semibold text-gold" : "text-[#9aa4b0] hover:text-ink"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-0 bottom-3 h-[3px] bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden items-center gap-[22px] md:flex">
        <span
          className="font-mono text-[10px] tracking-[0.12em] text-steel"
          title="achievements unlocked"
        >
          ★ {unlocked.length}/{total}
        </span>
        <button
          onClick={toggleMute}
          aria-label={muted ? "unmute sound" : "mute sound"}
          title={muted ? "sound: off" : "sound: on"}
          className={`border px-2 py-1 font-mono text-[10px] font-semibold tracking-[0.12em] ${
            muted
              ? "border-[#39424e] text-steel"
              : "border-green text-green"
          }`}
        >
          {muted ? "SFX OFF" : "SFX ON"}
        </button>
        <a
          href={profile.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-[13px] font-medium tracking-[0.1em] text-[#dfe6ee] hover:text-white"
        >
          <SocialBadge tag="G" />
          GITHUB
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-[13px] font-medium tracking-[0.1em] text-[#dfe6ee] hover:text-white"
        >
          <SocialBadge tag="in" />
          LINKEDIN
        </a>
        <a
          href={profile.cv}
          className="flex items-center gap-2 bg-gold px-[14px] py-1.5 text-[12px] font-bold tracking-[0.12em] text-[#10120a] hover:brightness-110"
        >
          CV ↓
        </a>
      </div>

      <MobileMenu />
    </header>
  );
}
