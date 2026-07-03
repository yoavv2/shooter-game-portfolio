"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Sparkles, useTexture } from "@react-three/drei";
import HoloCanvas, { useCoarsePointer } from "./HoloCanvas";

/** hologram blue — matches RARE accent / site cyan palette */
const HOLO = new THREE.Color("#5ab0ff");

// portrait plane sized to fit the shared camera (z=3.4, fov=42) with the
// frame's ~0.77 aspect (400×520 slot).
const PLANE_H = 2.5;
const PLANE_W = PLANE_H * 0.77;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// shared holo overlay: moving scanlines, faint grid, an upward scan sweep.
const HOLO_FX = /* glsl */ `
  float holoScan(vec2 uv, float t) {
    return mix(0.6, 1.0, 0.5 + 0.5 * sin(uv.y * 260.0 - t * 4.0));
  }
  float holoGrid(vec2 uv) {
    float gx = smoothstep(0.02, 0.0, abs(fract(uv.x * 18.0) - 0.5) - 0.47);
    float gy = smoothstep(0.02, 0.0, abs(fract(uv.y * 24.0) - 0.5) - 0.47);
    return clamp(gx + gy, 0.0, 1.0);
  }
  float holoSweep(vec2 uv, float t) {
    return smoothstep(0.035, 0.0, abs(uv.y - fract(t * 0.12)));
  }
`;

// procedural silhouette (head + shoulders) — used when no photo is supplied.
const FRAG_PROCEDURAL = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  ${HOLO_FX}

  float ell(vec2 p, vec2 c, vec2 r) { return length((p - c) / r); }

  void main() {
    vec2 uv = vUv;
    float head  = 1.0 - smoothstep(0.85, 1.0, ell(uv, vec2(0.5, 0.70), vec2(0.16, 0.20)));
    float torso = 1.0 - smoothstep(0.85, 1.0, ell(uv, vec2(0.5, 0.16), vec2(0.34, 0.30)));
    float mask  = clamp(head + torso, 0.0, 1.0);

    float scan  = holoScan(uv, uTime);
    float grid  = holoGrid(uv) * 0.25;
    float sweep = holoSweep(uv, uTime);
    float rim   = smoothstep(0.0, 0.5, mask) * smoothstep(1.0, 0.5, mask);

    vec3 col = uColor * (0.30 + 0.7 * scan);
    col += uColor * grid;
    col += uColor * sweep * 1.4;
    col += vec3(0.8, 0.95, 1.0) * rim * 0.6;

    float alpha = mask * (0.28 + 0.35 * scan) + mask * sweep * 0.8 + rim * 0.5 + mask * grid;
    alpha = clamp(alpha, 0.0, 0.95);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

// photo path — samples the portrait texture, tints it holo, overlays FX.
const FRAG_TEXTURED = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  uniform sampler2D uMap;
  ${HOLO_FX}

  void main() {
    vec2 uv = vUv;
    vec4 tex = texture2D(uMap, uv);

    float scan  = holoScan(uv, uTime);
    float grid  = holoGrid(uv) * 0.15;
    float sweep = holoSweep(uv, uTime);

    vec3 base = mix(tex.rgb, uColor, 0.35);
    vec3 col = base * (0.55 + 0.45 * scan) + uColor * sweep * 1.1 + uColor * grid;

    float alpha = clamp(tex.a * (0.82 + 0.18 * scan) + sweep * tex.a * 0.6, 0.0, 1.0);
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col, alpha);
  }
`;

/** tilt the plane toward the pointer for a parallax depth read */
function useParallax() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const { x, y } = state.pointer; // -1..1, updates while over canvas
    group.current.rotation.y += (x * 0.35 - group.current.rotation.y) * 0.06;
    group.current.rotation.x += (-y * 0.22 - group.current.rotation.x) * 0.06;
  });
  return group;
}

function ProceduralAvatar() {
  const group = useParallax();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: HOLO } }),
    [],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG_PROCEDURAL}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function TexturedAvatar({ src }: { src: string }) {
  const group = useParallax();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const map = useTexture(src); // suspends; caught by HoloCanvas <Suspense>
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: HOLO },
      uMap: { value: map },
    }),
    [map],
  );
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[PLANE_W, PLANE_H]} />
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG_TEXTURED}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function AvatarScene({ src }: { src?: string }) {
  const coarse = useCoarsePointer();
  return (
    <>
      <ambientLight intensity={0.4} />
      {src ? <TexturedAvatar src={src} /> : <ProceduralAvatar />}
      <Sparkles
        count={coarse ? 10 : 34}
        scale={[2.2, 3, 1.5]}
        size={2}
        speed={0.3}
        color={HOLO}
      />
    </>
  );
}

/**
 * Hologram operator frame (Phase 3). Composed with HoloCanvas so the page can
 * next/dynamic(ssr:false) this module — three stays out of the lobby's first
 * load. Renders a procedural bust until `public/me.png` (pass as `src`) exists.
 * Coarse pointer / reduced motion falls back to the static frame art.
 */
export default function HoloAvatar({ src }: { src?: string }) {
  return (
    <HoloCanvas
      className="h-full w-full cursor-crosshair"
      fallback={<StaticAvatarArt />}
    >
      <AvatarScene src={src} />
    </HoloCanvas>
  );
}

export function StaticAvatarArt() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[repeating-linear-gradient(0deg,rgba(90,176,255,0.10)_0_2px,transparent_2px_5px)]">
      <span className="font-mono text-[10px] tracking-hud text-[#5ab0ff99]">
        OPERATOR HOLOGRAM
      </span>
    </div>
  );
}
