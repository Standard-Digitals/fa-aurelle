"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";

/* ─── Bottle Model ─── */
function BottleModel({ capOpen = 0, rotation = 0 }: { capOpen: number; rotation: number }) {
  const groupRef = useRef<THREE.Group>(null);

  // Gentle idle float
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.015;
  });

  const capY = capOpen * 0.8;
  const capRotZ = capOpen * 0.2;

  return (
    <group ref={groupRef} rotation={[0, rotation, 0]} scale={0.5}>
      {/* Body — amber glass cylinder */}
      <mesh castShadow>
        <cylinderGeometry args={[0.38, 0.44, 1.6, 48, 1, false]} />
        <MeshTransmissionMaterial
          backside
          thickness={0.2}
          roughness={0.05}
          transmission={0.3}
          ior={1.52}
          chromaticAberration={0.006}
          color="#4A2508"
          attenuationColor="#8B4513"
          attenuationDistance={0.4}
        />
      </mesh>

      {/* Bottom rounded */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <sphereGeometry args={[0.44, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <MeshTransmissionMaterial
          backside thickness={0.15} roughness={0.05} transmission={0.3}
          ior={1.52} color="#4A2508" attenuationColor="#8B4513" attenuationDistance={0.4}
        />
      </mesh>

      {/* Shoulder */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.38, 0.35, 48]} />
        <MeshTransmissionMaterial
          backside thickness={0.15} roughness={0.05} transmission={0.3}
          ior={1.52} color="#4A2508" attenuationColor="#8B4513" attenuationDistance={0.4}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.25, 32]} />
        <MeshTransmissionMaterial
          backside thickness={0.1} roughness={0.06} transmission={0.25}
          ior={1.52} color="#4A2508" attenuationColor="#8B4513" attenuationDistance={0.4}
        />
      </mesh>

      {/* Gold collar */}
      <mesh position={[0, 1.38, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.15, 48]} />
        <meshStandardMaterial color="#B8860B" metalness={0.97} roughness={0.08} envMapIntensity={2.5} />
      </mesh>
      {/* Gold collar top rim */}
      <mesh position={[0, 1.47, 0]}>
        <torusGeometry args={[0.18, 0.015, 8, 48]} />
        <meshStandardMaterial color="#DAA520" metalness={0.95} roughness={0.06} envMapIntensity={3} />
      </mesh>

      {/* Label — cream */}
      <mesh position={[0, 0.05, 0.395]}>
        <planeGeometry args={[0.48, 0.6]} />
        <meshStandardMaterial color="#F5ECD7" roughness={0.95} metalness={0} />
      </mesh>
      {/* Label gold border */}
      <mesh position={[0, 0.05, 0.396]}>
        <planeGeometry args={[0.5, 0.62]} />
        <meshStandardMaterial color="#C5A028" roughness={0.25} metalness={0.75} transparent opacity={0.25} />
      </mesh>

      {/* Black band at bottom */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.445, 0.445, 0.05, 48]} />
        <meshStandardMaterial color="#111" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Cap/Pump group */}
      <group position={[0, 1.5 + capY, 0]} rotation={[0, 0, capRotZ]}>
        {/* Pump base */}
        <mesh castShadow>
          <cylinderGeometry args={[0.11, 0.13, 0.18, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.35} />
        </mesh>
        {/* Pump stem */}
        <mesh position={[0, 0.13, 0]}>
          <cylinderGeometry args={[0.03, 0.035, 0.12, 16]} />
          <meshStandardMaterial color="#111" roughness={0.35} metalness={0.4} />
        </mesh>
        {/* Pump head — tilted */}
        <group position={[0.05, 0.24, 0]} rotation={[0, 0, -0.3]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.045, 0.06, 8, 16]} />
            <meshStandardMaterial color="#0d0d0d" roughness={0.28} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.065, 0]}>
            <cylinderGeometry args={[0.015, 0.02, 0.03, 12]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/* ─── Exported Component ─── */
export function FloatingBottle({ scrollProgress }: { scrollProgress: number }) {
  // Rotation: smooth continuous rotation as user scrolls
  const rotation = scrollProgress * Math.PI * 6;

  // Cap opens at 50-60% scroll (before ingredients show at 60%)
  const capOpen = Math.max(0, Math.min(1, (scrollProgress - 0.50) / 0.10));

  return (
    <Canvas
      className="pointer-events-none"
      camera={{ position: [0, 0.1, 3], fov: 28 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.3} />
        <directionalLight position={[3, 5, 4]} intensity={1.5} color="#fff5e6" castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.3} color="#e8f0ff" />
        <directionalLight position={[0, 2, -4]} intensity={0.4} color="#fff" />
        <ambientLight intensity={0.1} />
        <BottleModel capOpen={capOpen} rotation={rotation} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
