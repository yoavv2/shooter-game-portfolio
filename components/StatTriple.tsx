import { stats } from "@/lib/data";

export default function StatTriple() {
  return (
    <div className="flex gap-16">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col items-center gap-[5px]">
          <div
            className="flex h-[34px] w-[34px] items-center justify-center border font-mono text-[10px] font-bold"
            style={{ borderColor: s.border, background: s.bg, color: s.color }}
          >
            {s.tag}
          </div>
          <div className="text-[11px] font-semibold tracking-wide2 text-muted">
            {s.label}
          </div>
          <div
            className="text-[22px] font-bold font-display"
            style={{ color: s.color }}
          >
            {s.value}/100
          </div>
        </div>
      ))}
    </div>
  );
}
