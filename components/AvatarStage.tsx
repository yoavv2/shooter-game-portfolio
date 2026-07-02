"use client";

import dynamic from "next/dynamic";

// three + R3F stay out of the lobby page chunk; loads only on the client.
const HoloAvatar = dynamic(() => import("@/components/three/HoloAvatar"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="font-mono text-[10px] tracking-hud text-[#5ab0ff99]">
        CALIBRATING HOLOGRAM…
      </span>
    </div>
  ),
});

/**
 * Bordered operator frame around the hologram avatar. `src` wires the real
 * photo (public/me.png) once provided; until then the canvas renders a
 * procedural bust.
 */
export default function AvatarStage({
  src,
  className = "",
}: {
  src?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-line bg-[rgba(12,16,22,0.5)] ${className}`}
    >
      {/* corner brackets — HUD frame accents */}
      <Corner className="left-1.5 top-1.5 border-l border-t" />
      <Corner className="right-1.5 top-1.5 border-r border-t" />
      <Corner className="bottom-1.5 left-1.5 border-b border-l" />
      <Corner className="bottom-1.5 right-1.5 border-b border-r" />
      <HoloAvatar src={src} />
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <span
      className={`pointer-events-none absolute z-10 h-4 w-4 border-[#5ab0ff]/50 ${className}`}
    />
  );
}
