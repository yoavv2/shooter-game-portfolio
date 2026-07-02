import { Mission, rarityColor } from "@/lib/data";

export default function MissionGridCard({ mission }: { mission: Mission }) {
  return (
    <div className="flex flex-col border border-line bg-[rgba(13,17,23,0.9)] transition-colors hover:border-[#39424e]">
      <div className="hatch relative flex h-[96px] items-center justify-center">
        <span className="font-mono text-[10px] text-faint">
          {mission.slug} screenshot
        </span>
        <span
          className="absolute left-[10px] top-2 font-mono text-[9px] font-semibold tracking-[0.12em]"
          style={{ color: rarityColor[mission.rarity] }}
        >
          {mission.rarity}
        </span>
      </div>
      <div className="flex flex-col gap-2 px-[14px] py-3">
        <div className="text-[16px] font-bold text-ink2">
          {mission.name.toUpperCase()}
        </div>
        <div className="text-[11.5px] leading-[1.5] text-muted">
          {mission.blurb}
        </div>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="font-mono text-[10px] text-steel">
            {mission.stack.join(" · ")}
          </span>
          <span className="bg-gold px-[14px] py-[5px] text-[11px] font-bold tracking-[0.14em] text-[#141105]">
            DEPLOY
          </span>
        </div>
      </div>
    </div>
  );
}
