"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useParallax } from "./HoloAvatar";

/**
 * GLB mesh rendered with its real PBR materials — auto-fits the model into the
 * operator frame with a slow idle spin. Suspends on load; caught by HoloCanvas
 * <Suspense>. Lighting/environment live in AvatarScene.
 */
export default function MeshAvatar({ url }: { url: string }) {
  const group = useParallax();
  const inner = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  // clone so material/scene mutations never leak into the cached GLTF
  const model = useMemo(() => scene.clone(true), [scene]);

  // auto-fit: scale so the model is ~frame-height, recenter on origin
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
  }, [model]);

  useFrame((_, dt) => {
    if (inner.current) inner.current.rotation.y += dt * 0.4; // slow spin
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        <primitive object={model} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
