import type { Metadata } from "next";
import Shell from "@/components/Shell";
import MissionGridCard from "@/components/MissionGridCard";
import { getMissions } from "@/lib/missions";

export const metadata: Metadata = {
  title: "Missions — Yoav Hevroni",
  description: "Selected projects: shipped production web apps.",
};

export default function MissionsPage() {
  const missions = getMissions();
  return (
    <Shell glow="70% 20%">
      <div className="flex flex-1 flex-col px-6 py-8 lg:px-[34px]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[12px] tracking-wide3 text-faint">
            OPERATION LOG // 2026
          </span>
        </div>
        <div className="mb-3 mt-4 flex items-baseline justify-between">
          <h1 className="text-[15px] font-bold tracking-wide2 text-[#f4f7fa]">
            SELECT MISSION
          </h1>
          <span className="font-mono text-[11px] text-faint">
            {missions.length} AVAILABLE
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((m) => (
            <MissionGridCard key={m.slug} mission={m} />
          ))}
        </div>
      </div>
    </Shell>
  );
}
