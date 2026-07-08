"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";

/**
 * GLB mesh rendered with its real PBR materials. Auto-fits into the operator
 * frame; the user rotates it by dragging (mouse or touch) and it holds the
 * angle it's left at — no idle spin. Suspends on load; caught by HoloCanvas
 * <Suspense>. Lighting/environment live in AvatarScene.
 */
export default function MeshAvatar({ url }: { url: string }) {
  const inner = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  // clone so material/scene mutations never leak into the cached GLTF
  const model = useMemo(() => scene.clone(true), [scene]);

  // drag state — persists in refs so a rerender never resets the pose
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // auto-fit: scale so the model is ~frame-height, recenter on origin, and
  // face the camera. Runs once per model.
  useLayoutEffect(() => {
    if (!inner.current) return;
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const target = 2.3; // frame height in world units
    const s = target / Math.max(size.y, 0.0001);
    inner.current.scale.setScalar(s);
    inner.current.position.set(-center.x * s, -center.y * s, -center.z * s);
    inner.current.rotation.set(0, 0, 0);
  }, [model]);

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    // capture so drags that leave the model keep feeding move events
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    dragging.current = false;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current || !inner.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    inner.current.rotation.y += dx * 0.01;
    // clamp vertical tilt so the model never flips upside down (~±34°)
    inner.current.rotation.x = THREE.MathUtils.clamp(
      inner.current.rotation.x + dy * 0.01,
      -0.6,
      0.6,
    );
  };

  return (
    <group
      ref={inner}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerMove={onMove}
    >
      <primitive object={model} />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
