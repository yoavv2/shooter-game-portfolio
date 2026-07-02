"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";

/**
 * Shared lazy R3F stage. Consumers import this only from modules loaded via
 * next/dynamic(ssr:false) so three never lands in the server bundle or in
 * three-free routes. Renders `fallback` instead of a canvas on coarse
 * pointers / reduced motion (mobile degrades to static per plan).
 */
export default function HoloCanvas({
  children,
  fallback = null,
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}) {
  // null = capability unknown (first client render matches SSR-less mount)
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !still);
  }, []);

  if (!enabled) return <>{fallback}</>;

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.4], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
