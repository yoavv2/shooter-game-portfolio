import HudBar from "./HudBar";

/**
 * Page frame: fixed HUD bar on top, radial "arena glow" background behind the
 * content. `glow` sets the gradient focal point per screen (matches the design
 * canvases, which each aim the light from a different corner).
 */
export default function Shell({
  glow = "55% 32%",
  children,
}: {
  glow?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: `radial-gradient(1100px 640px at ${glow}, #151b25 0%, #0b0e13 62%)`,
      }}
    >
      <HudBar />
      <main className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
