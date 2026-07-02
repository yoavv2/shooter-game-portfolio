import Link from "next/link";
import Shell from "@/components/Shell";
import AvatarStage from "@/components/AvatarStage";
import StatTriple from "@/components/StatTriple";
import { missions, profile, rarityColor, rarityChip } from "@/lib/data";

export default function LobbyPage() {
  return (
    <Shell glow="55% 32%">
      <div className="flex flex-1 flex-col gap-6 px-6 py-6 lg:flex-row lg:gap-6 lg:px-[30px] lg:pb-[22px] lg:pt-[26px]">
        {/* LEFT — missions */}
        <section className="flex w-full flex-col gap-[14px] lg:w-[300px] lg:flex-none">
          <h2 className="text-[20px] font-bold tracking-[0.12em] text-[#f4f7fa]">
            MISSIONS
          </h2>
          {missions.map((m) => (
            <div
              key={m.slug}
              className="flex flex-col gap-[11px] border border-line bg-[rgba(15,19,26,0.88)] px-4 pb-[18px] pt-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[16px] font-semibold text-ink2">
                  {m.name}
                </span>
                <span
                  className="font-mono text-[9px] font-semibold tracking-[0.14em]"
                  style={{ color: rarityColor[m.rarity] }}
                >
                  {m.rarity}
                </span>
              </div>
              <p className="text-[12.5px] leading-[1.5] text-muted">{m.blurb}</p>
              {m.progress >= 100 && (
                <div className="mt-0.5 flex flex-col gap-[5px]">
                  <div className="flex justify-between text-[12px] font-medium text-[#c6ced6]">
                    <span>shipped</span>
                    <span>{m.progress}%</span>
                  </div>
                  <div className="h-1 bg-[#222a34]">
                    <div
                      className="h-1 bg-ink"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="mt-1 font-mono text-[10px] tracking-hud text-steel">
                REWARD:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {m.stack.map((tech) => {
                  const c = rarityChip[m.rarity];
                  return (
                    <span
                      key={tech}
                      className={`border px-2 py-[3px] font-mono text-[10.5px] font-semibold ${c.text} ${c.border} ${c.bg}`}
                    >
                      {tech}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* CENTER — operator */}
        <section className="flex flex-1 flex-col items-center">
          <div className="mt-0.5 text-[22px] font-semibold tracking-[0.06em] text-ink2">
            {profile.name}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-[7px] w-[7px] animate-blinkdot bg-green" />
            <span className="text-[12px] font-semibold tracking-wide2 text-green">
              {profile.status}
            </span>
          </div>
          <AvatarStage 
           src="/me.png"
          className="mt-[18px] h-[520px] w-full max-w-[400px]" />
          <div className="mt-[22px]">
            <StatTriple />
          </div>
        </section>

        {/* RIGHT — deploy panel */}
        <section className="flex w-full flex-col justify-end lg:w-[310px] lg:flex-none">
          <div className="flex flex-col gap-[14px] border border-line bg-[rgba(15,19,26,0.92)] p-4">
            <div className="hatch relative flex h-[150px] items-end overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-faint">
                featured project screenshot
              </div>
              <div className="relative w-full bg-[linear-gradient(transparent,rgba(5,7,10,0.9))] px-3 py-2.5 text-[19px] font-bold tracking-[0.06em] text-white">
                GAPHUNTER
              </div>
            </div>
            <div className="flex gap-[22px]">
              <div className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center border border-green font-mono text-[11px] font-bold text-green">
                  ✓
                </span>
                <span className="text-[13px] font-medium tracking-[0.08em] text-[#dfe6ee]">
                  Remote
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border border-[#39424e]" />
                <span className="text-[13px] font-medium tracking-[0.08em] text-steel">
                  On-site TLV
                </span>
              </div>
            </div>
            <Link
              href="/missions"
              className="bg-ink py-[11px] text-center text-[13px] font-bold tracking-wide2 text-[#10141a] hover:brightness-95"
            >
              ALL MISSIONS
            </Link>
            <Link
              href="/comms"
              className="clip-bevel bg-gold py-4 text-center text-[24px] font-bold tracking-wide3 text-[#141105] hover:brightness-110"
            >
              HIRE ME
            </Link>
          </div>
        </section>
      </div>

      {/* footer contact strip */}
      <div className="flex flex-none flex-col gap-2 px-6 pb-4 font-mono text-[11px] text-faint sm:flex-row sm:items-center sm:justify-between lg:px-[26px]">
        <span>
          TLV · UTC+3 · {profile.phone}
        </span>
        <a href={`mailto:${profile.email}`} className="hover:text-ink">
          {profile.email}
        </a>
      </div>
    </Shell>
  );
}
