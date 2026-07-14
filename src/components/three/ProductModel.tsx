"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Center } from "@react-three/drei";
import { Suspense } from "react";

function SerumModel() {
  const { scene } = useGLTF("/models/Serum3.glb");
  return (
    <Center>
      <primitive object={scene} scale={18} />
    </Center>
  );
}

export function ProductModel() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, 4]} intensity={0.4} />
      <Suspense fallback={null}>
        <SerumModel />
        <Environment preset="studio" environmentIntensity={0.5} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.3} blur={2} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
    </Canvas>
  );
}

useGLTF.preload("/models/Serum3.glb");
