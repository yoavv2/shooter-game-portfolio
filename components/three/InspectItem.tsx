"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import HoloCanvas from "./HoloCanvas";
import { rarityColor, tierToRarity, type SkillTier } from "@/lib/data";

/** deterministic per-skill starting pose so each item reads as distinct */
function nameSeed(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return (h >>> 0) / 0xffffffff;
}

function tierGeometry(tier: SkillTier) {
  // higher rarity = more facets; all procedural primitives, no assets
  switch (tier) {
    case "LGD":
      return new THREE.IcosahedronGeometry(1, 1);
    case "EPC":
      return new THREE.OctahedronGeometry(1, 0);
    case "RAR":
      return new THREE.BoxGeometry(1.15, 1.15, 1.15);
  }
}

function HoloItem({ tier, name }: { tier: SkillTier; name: string }) {
  const color = rarityColor[tierToRarity[tier]];
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => tierGeometry(tier), [tier]);
  const seed = useMemo(() => nameSeed(name), [name]);

  // slow idle spin on top of OrbitControls drag
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.35;
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      {/* rarity rim lights, behind-left and behind-right */}
      <pointLight position={[-3, 1.5, -2]} intensity={26} color={color} />
      <pointLight position={[3, -1, -2]} intensity={20} color={color} />
      <pointLight position={[0, 2, 3]} intensity={8} color="#cfe3ff" />

      <Float speed={2.2} rotationIntensity={0.25} floatIntensity={0.6}>
        <group ref={group} rotation={[seed * Math.PI, seed * Math.PI * 2, 0]}>
          {/* translucent core catches the rim light */}
          <mesh geometry={geometry}>
            <meshStandardMaterial
              color="#0d1117"
              emissive={color}
              emissiveIntensity={0.22}
              metalness={0.85}
              roughness={0.25}
              transparent
              opacity={0.55}
            />
          </mesh>
          {/* hologram wireframe shell */}
          <mesh geometry={geometry} scale={1.06}>
            <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
          </mesh>
        </group>
      </Float>

      <Sparkles count={26} scale={3} size={2} speed={0.35} color={color} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.9} />
    </>
  );
}

/**
 * Default export composed with HoloCanvas so LoadoutInventory can
 * next/dynamic(ssr:false) this one module and keep three out of the
 * main chunk. Fallback = the original static striped art slot.
 */
export default function InspectItem({
  tier,
  name,
}: {
  tier: SkillTier;
  name: string;
}) {
  return (
    <HoloCanvas
      className="h-40 cursor-grab active:cursor-grabbing"
      fallback={<StaticItemArt tier={tier} />}
    >
      <HoloItem tier={tier} name={name} />
    </HoloCanvas>
  );
}

export function StaticItemArt({ tier }: { tier: SkillTier }) {
  const color = rarityColor[tierToRarity[tier]];
  return (
    <div
      className="flex h-40 items-center justify-center"
      style={{
        background: `repeating-linear-gradient(45deg, ${color}26 0 10px, rgba(20,24,31,0.9) 10px 20px)`,
      }}
    >
      <span className="font-mono text-[10px]" style={{ color: `${color}cc` }}>
        item art
      </span>
    </div>
  );
}
