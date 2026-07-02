import type { Metadata } from "next";
import Shell from "@/components/Shell";
import PhotoSlot from "@/components/PhotoSlot";
import Terminal from "@/components/game/Terminal";
import { profile } from "@/lib/data";

export const metadata: Metadata = {
  title: "Comms — Yoav Hevroni",
  description: "Get in touch. Open to full-stack roles, remote or Tel Aviv.",
};

export default function CommsPage() {
  return (
    <Shell glow="70% 20%">
      <div className="flex flex-1 flex-col gap-9 px-6 py-10 lg:flex-row lg:gap-9 lg:px-[34px]">
        {/* LEFT — briefing hero */}
        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2.5">
            <span className="h-[7px] w-[7px] animate-blinkdot bg-green" />
            <span className="text-[12px] font-semibold tracking-wide3 text-green">
              STATUS: {profile.status}
            </span>
          </div>

          <h1 className="mt-3 text-[56px] font-bold leading-[0.95] tracking-[0.01em] text-[#f4f7fa] sm:text-[72px] lg:text-[84px]">
            YOAV
            <br />
            HEVRONI
          </h1>

          <div className="mt-3.5 text-[15px] font-medium tracking-wide3 text-gold">
            {profile.role}
          </div>

          <div className="mt-[22px] flex max-w-[560px] flex-col gap-2 border border-line bg-[rgba(13,17,23,0.9)] px-[18px] py-4">
            <div className="font-mono text-[10px] font-semibold tracking-wide2 text-steel">
              BRIEFING.TXT
            </div>
            <div className="font-mono text-[13px] leading-[1.7] text-[#b9c2cc]">
              {profile.briefing.map((line, i) => (
                <div key={i}>
                  <span className="text-green">&gt;</span> {line}
                </div>
              ))}
            </div>
          </div>

          {/* contact channels */}
          <div className="mt-[22px] flex max-w-[560px] flex-col gap-2.5">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center justify-between border border-line bg-[rgba(13,17,23,0.9)] px-4 py-3 hover:border-gold"
            >
              <span className="font-mono text-[11px] tracking-hud text-steel">
                EMAIL
              </span>
              <span className="text-[14px] text-ink">{profile.email}</span>
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-between border border-line bg-[rgba(13,17,23,0.9)] px-4 py-3 hover:border-gold"
            >
              <span className="font-mono text-[11px] tracking-hud text-steel">
                PHONE
              </span>
              <span className="text-[14px] text-ink">{profile.phone}</span>
            </a>
          </div>

          <div className="mt-[22px] flex flex-wrap gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="clip-bevel bg-gold px-[34px] py-[13px] text-[16px] font-bold tracking-wide2 text-[#141105] hover:brightness-110"
            >
              START MISSION
            </a>
            <a
              href={profile.cv}
              className="flex items-center border border-[#39424e] px-7 py-[13px] text-[14px] font-bold tracking-wide2 text-[#dfe6ee] hover:border-ink"
            >
              CV ↓
            </a>
          </div>
        </section>

        {/* RIGHT — operative file card */}
        <section className="flex w-full flex-col lg:w-[340px] lg:flex-none">
          <div className="mb-3 font-mono text-[12px] tracking-wide3 text-faint">
            OPERATIVE FILE // 2026
          </div>
          <PhotoSlot src="/me.png" className="h-[400px] w-full max-w-[340px]" />
          <div className="flex w-full max-w-[340px] justify-between border border-t-0 border-line bg-[rgba(13,17,23,0.9)] px-3.5 py-3">
            {[
              { label: "FRONTEND", value: "95", color: "#f2c41d" },
              { label: "BACKEND", value: "88", color: "#a3d514" },
              { label: "AI-DEV", value: "100", color: "#3b9dff" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold tracking-wide2 text-muted">
                  {s.label}
                </span>
                <span
                  className="text-[18px] font-bold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* backdoor terminal */}
      <div className="px-6 pb-12 lg:px-[34px]">
        <div className="mb-3 font-mono text-[12px] tracking-wide3 text-faint">
          DIRECT UPLINK // TERMINAL
        </div>
        <Terminal />
      </div>
    </Shell>
  );
}
