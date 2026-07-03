import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import { rarityColor, rarityChip } from "@/lib/data";
import { getMission, getMissions } from "@/lib/missions";

export function generateStaticParams() {
  return getMissions().map((m) => ({ slug: m.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const mission = getMission(params.slug);
  if (!mission) return { title: "Mission not found" };
  return {
    title: `${mission.name} — Yoav Hevroni`,
    description: mission.blurb,
  };
}

export default function MissionPage({
  params,
}: {
  params: { slug: string };
}) {
  const mission = getMission(params.slug);
  if (!mission) notFound();

  const chip = rarityChip[mission.rarity];

  return (
    <Shell glow="30% 15%">
      <div className="flex flex-1 flex-col px-6 py-8 lg:px-[34px]">
        <Link
          href="/missions"
          className="w-fit font-mono text-[11px] tracking-wide2 text-faint hover:text-ink"
        >
          ← BACK TO MISSION SELECT
        </Link>

        {/* hero screenshot */}
        {mission.image && (
          <div className="relative mt-5 h-[220px] max-w-[820px] overflow-hidden border border-b-0 border-line sm:h-[300px]">
            <Image
              src={mission.image}
              alt={`${mission.name} screenshot`}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* header */}
        <div
          className={`flex max-w-[820px] flex-col gap-3 border border-line bg-[rgba(13,17,23,0.9)] px-[22px] py-5 ${
            mission.image ? "" : "mt-5"
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h1 className="text-[26px] font-bold tracking-[0.04em] text-[#f4f7fa]">
              {mission.name.toUpperCase()}
            </h1>
            <span
              className="font-mono text-[10px] font-semibold tracking-[0.14em]"
              style={{ color: rarityColor[mission.rarity] }}
            >
              {mission.rarity} MISSION
            </span>
          </div>
          <p className="max-w-[640px] text-[13.5px] leading-[1.6] text-muted">
            {mission.blurb}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {mission.stack.map((tech) => (
              <span
                key={tech}
                className={`border px-2 py-[3px] font-mono text-[10.5px] font-semibold ${chip.text} ${chip.border} ${chip.bg}`}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-1 flex max-w-[420px] flex-col gap-[5px]">
            <div className="flex justify-between font-mono text-[10px] tracking-hud text-steel">
              <span>MISSION PROGRESS</span>
              <span>{mission.progress}%</span>
            </div>
            <div className="h-1 bg-[#222a34]">
              <div
                className="h-1 bg-ink"
                style={{ width: `${mission.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2.5">
            {mission.liveUrl ? (
              <a
                href={mission.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="clip-bevel-sm bg-gold px-6 py-[10px] text-[13px] font-bold tracking-wide2 text-[#141105] hover:brightness-110"
              >
                DEPLOY ↗
              </a>
            ) : (
              <span className="border border-[#39424e] px-6 py-[10px] font-mono text-[11px] font-semibold tracking-wide2 text-steel">
                OFFLINE — INTEL ONLY
              </span>
            )}
            {mission.repoUrl && (
              <a
                href={mission.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#39424e] px-6 py-[10px] text-[13px] font-bold tracking-wide2 text-[#dfe6ee] hover:border-ink"
              >
                SOURCE ↗
              </a>
            )}
          </div>
        </div>

        {/* markdown intel body */}
        <div className="mt-4 max-w-[820px] border border-line bg-[rgba(13,17,23,0.9)] px-[22px] py-5">
          <div className="mb-4 font-mono text-[10px] font-semibold tracking-wide2 text-steel">
            MISSION INTEL // {mission.slug}.md
          </div>
          <div
            className="intel-body"
            dangerouslySetInnerHTML={{ __html: mission.html }}
          />
        </div>
      </div>
    </Shell>
  );
}
