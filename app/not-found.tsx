import Link from "next/link";
import Shell from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell glow="50% 40%">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-20 text-center">
        <div className="font-mono text-[12px] tracking-wide3 text-red">
          ⚠ SIGNAL LOST
        </div>
        <h1 className="text-[64px] font-bold leading-none tracking-[0.06em] text-[#f4f7fa] sm:text-[96px]">
          404
        </h1>
        <p className="max-w-[420px] font-mono text-[13px] leading-[1.7] text-muted">
          <span className="text-green">&gt;</span> TARGET NOT FOUND — MIA
          <br />
          <span className="text-green">&gt;</span> Coordinates don&apos;t match any
          known sector. Fall back and regroup.
        </p>
        <Link
          href="/"
          className="clip-bevel mt-3 bg-gold px-8 py-3 text-[15px] font-bold tracking-wide2 text-[#141105] hover:brightness-110"
        >
          RETURN TO BASE
        </Link>
      </div>
    </Shell>
  );
}
