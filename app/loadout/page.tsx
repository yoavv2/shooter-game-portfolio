import type { Metadata } from "next";
import Link from "next/link";
import Shell from "@/components/Shell";
import PhotoSlot from "@/components/PhotoSlot";
import LoadoutInventory from "@/components/LoadoutInventory";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Loadout — Yoav Hevroni",
  description: "Skills inventory: frontend, backend, AI-assisted dev, tooling.",
};

export default function LoadoutPage() {
  return (
    <Shell glow="40% 30%">
      <div className="flex flex-1 flex-col gap-7 px-6 py-6 lg:flex-row lg:gap-7 lg:px-[30px]">
        {/* LEFT — operator card */}
        <section className="flex w-full flex-col items-center lg:w-[360px] lg:flex-none">
          <PhotoSlot src="/me.png" className="h-[470px] w-full max-w-[360px]" />
          <div className="flex w-full max-w-[360px] flex-col gap-1.5 border border-t-0 border-line bg-[rgba(15,19,26,0.92)] px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[19px] font-semibold text-ink2">
                {profile.name}
              </span>
              <span className="font-mono text-[10px] font-semibold tracking-[0.12em] text-green">
                ● READY
              </span>
            </div>
            <div className="text-[12px] font-medium tracking-wide text-muted">
              FULL-STACK · FRONTEND CLASS
            </div>
            <div className="font-mono text-[11px] text-faint">
              TLV · 4+ yrs · React / TS / Node
            </div>
          </div>
          <div className="mt-3.5 flex w-full max-w-[360px] gap-2.5">
            <Link
              href="/comms"
              className="clip-bevel-sm flex-1 bg-gold py-3 text-center text-[15px] font-bold tracking-wide2 text-[#141105] hover:brightness-110"
            >
              HIRE ME
            </Link>
            <Link
              href="/missions"
              className="flex-1 bg-ink py-3 text-center text-[15px] font-bold tracking-wide2 text-[#10141a] hover:brightness-95"
            >
              MISSIONS
            </Link>
          </div>
        </section>

        {/* CENTER inventory + RIGHT inspect (interactive) */}
        <LoadoutInventory />
      </div>
    </Shell>
  );
}
