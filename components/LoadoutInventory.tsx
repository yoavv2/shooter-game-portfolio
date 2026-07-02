"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  skillGroups,
  gear,
  tierStyle,
  tierToRarity,
  rarityColor,
  type SkillItem,
} from "@/lib/data";
import { useAchievements } from "@/components/game/AchievementsProvider";
import { useSound } from "@/components/game/SoundProvider";

// three + R3F stay out of the page chunk; loads only when /loadout mounts
const InspectItem = dynamic(() => import("@/components/three/InspectItem"), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 items-center justify-center bg-[repeating-linear-gradient(45deg,rgba(138,106,20,0.22)_0_10px,rgba(20,24,31,0.9)_10px_20px)]">
      <span className="font-mono text-[10px] text-[#8a7434]">
        CALIBRATING HOLOGRAM…
      </span>
    </div>
  ),
});

const totalItems =
  skillGroups.reduce((n, g) => n + g.items.length, 0) + gear.length;

export default function LoadoutInventory() {
  const [selected, setSelected] = useState<SkillItem>(skillGroups[0].items[0]);
  const { unlock } = useAchievements();
  const { play } = useSound();

  const inspect = (item: SkillItem) => {
    unlock("INSPECTED_ITEM");
    if (item.name !== selected.name) {
      play("deploy");
      setSelected(item);
    }
  };

  const accent = rarityColor[tierToRarity[selected.tier]];

  return (
    <>
      {/* CENTER — inventory */}
      <section className="flex min-w-0 flex-1 flex-col gap-[18px]">
        <div className="flex items-baseline gap-3.5">
          <h1 className="text-[20px] font-bold tracking-[0.12em] text-[#f4f7fa]">
            LOADOUT
          </h1>
          <span className="font-mono text-[12px] text-faint">
            {totalItems} / {totalItems} equipped
          </span>
        </div>

        {skillGroups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <div className="text-[11px] font-semibold tracking-wide2 text-steel">
              {group.title}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => {
                const t = tierStyle[item.tier];
                const active = item.name === selected.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => inspect(item)}
                    aria-pressed={active}
                    className={`relative flex h-[66px] items-end border p-2.5 text-left ${t.border} ${t.grad} ${
                      group.size === "wide" ? "w-[184px]" : "w-[120px]"
                    } ${
                      active
                        ? "shadow-[0_0_0_1px_#e8edf2,0_0_14px_rgba(232,237,242,0.15)]"
                        : "hover:brightness-125"
                    }`}
                  >
                    <span
                      className={`font-mono text-[12px] font-semibold ${t.text}`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`absolute right-2 top-1.5 font-mono text-[8px] font-semibold ${t.badge}`}
                    >
                      {item.tier}
                    </span>
                    {active && (
                      <span className="absolute left-2 top-1.5 font-mono text-[8px] font-semibold text-ink">
                        ▸
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-1.5">
          <div className="text-[11px] font-semibold tracking-wide2 text-steel">
            GEAR — TOOLING
          </div>
          <div className="flex flex-wrap gap-2">
            {gear.map((g) => (
              <div
                key={g}
                className="flex h-[44px] w-[88px] items-center justify-center border border-[#2a3340] bg-[#12161d]"
              >
                <span className="font-mono text-[11px] font-medium text-[#9aa4b0]">
                  {g}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT — item inspect */}
      <section className="flex w-full flex-col justify-center lg:w-[300px] lg:flex-none">
        <div
          key={selected.name}
          className="route-reveal flex flex-col gap-3 border border-[#39424e] bg-[rgba(13,17,23,0.96)] p-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        >
          <div
            className="font-mono text-[10px] font-semibold tracking-hud"
            style={{ color: accent }}
          >
            {tierToRarity[selected.tier]}
          </div>
          <div className="text-[22px] font-bold tracking-[0.04em] text-[#f4f7fa]">
            {selected.name.toUpperCase()}
          </div>
          <InspectItem tier={selected.tier} name={selected.name} />
          <div className="text-[11px] font-medium tracking-wide text-muted">
            ◎ {selected.klass}
          </div>
          <p className="text-[12px] leading-[1.55] text-[#9aa4b0]">
            {selected.desc}
          </p>
          <div className="mt-1 flex flex-col gap-2.5">
            {selected.stats.map((bar) => (
              <div key={bar.label} className="flex flex-col gap-1">
                <div className="flex justify-between text-[12px] font-semibold tracking-[0.1em] text-[#dfe6ee]">
                  <span>{bar.label}</span>
                  <span style={{ color: accent }}>{bar.value}</span>
                </div>
                <div className="h-[3px] bg-[#222a34]">
                  <div
                    className="h-[3px] transition-[width] duration-500"
                    style={{ width: `${bar.value}%`, background: accent }}
                  />
                </div>
              </div>
            ))}
          </div>
          {selected.synergy && (
            <div className="flex items-center gap-2.5 border-t border-[#222a34] pt-3">
              <span className="flex h-[26px] w-[26px] items-center justify-center border border-[#3d5214] bg-[rgba(61,82,20,0.2)] font-mono text-[9px] font-bold text-[#a3d514]">
                +
              </span>
              <span className="text-[12px] font-semibold text-[#a3d514]">
                {selected.synergy}
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
