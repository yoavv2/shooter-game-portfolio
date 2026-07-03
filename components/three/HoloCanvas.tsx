"use client";

import {
  Component,
  Suspense,
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Canvas } from "@react-three/fiber";

/**
 * True inside a HoloCanvas running on a coarse pointer (touch). Scene
 * components read this via useCoarsePointer() to shed cost on mobile —
 * fewer Sparkles, no antialias — while keeping the same visual identity.
 * Lives inside <Canvas> because R3F is a separate reconciler root: a
 * provider placed outside the canvas would not reach the scene.
 */
const CoarseContext = createContext(false);
export function useCoarsePointer() {
  return useContext(CoarseContext);
}

/** cheap feature test — a static fallback beats a hard crash on no-WebGL */
function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/** any runtime error in the R3F tree falls back to the static art */
class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() {
    return { crashed: true };
  }
  render() {
    return this.state.crashed ? (
      <>{this.props.fallback}</>
    ) : (
      this.props.children
    );
  }
}

/**
 * Shared lazy R3F stage. Consumers import this only from modules loaded via
 * next/dynamic(ssr:false) so three never lands in the server bundle or in
 * three-free routes. The canvas renders on both desktop and touch; the
 * static `fallback` shows only when the user prefers reduced motion, WebGL
 * is unavailable, or the canvas crashes. Coarse pointers get a lighter
 * scene (clamped DPR, no antialias, reduced Sparkles) — same look, cheaper
 * to draw.
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
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
    setEnabled(!reduced && webglAvailable());
  }, []);

  if (!enabled) return <>{fallback}</>;

  return (
    <div className={className}>
      <CanvasErrorBoundary fallback={fallback}>
        <Canvas
          // desktop unchanged at 1.5; on touch this clamps the phone's
          // native 2–3× DPR down to 1.5, the main mobile draw-cost saving.
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 3.4], fov: 42 }}
          gl={{ alpha: true, antialias: !coarse }}
          style={{ background: "transparent" }}
        >
          <CoarseContext.Provider value={coarse}>
            <Suspense fallback={null}>{children}</Suspense>
          </CoarseContext.Provider>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
