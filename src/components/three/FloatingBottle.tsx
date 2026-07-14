"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

interface FloatingBottleProps {
  scrollProgress?: number;
}

export function FloatingBottle({ scrollProgress = 0 }: FloatingBottleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const centerOffsetRef = useRef(new THREE.Vector3());
  const [loading, setLoading] = useState(true);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(5, 8, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-4, 4, 4);
    scene.add(fill);
    const back = new THREE.DirectionalLight(0xffffff, 0.3);
    back.position.set(0, 5, -8);
    scene.add(back);

    // Load model
    new GLTFLoader().load("/models/Serum3.glb", (gltf) => {
      const model = gltf.scene;
      scene.add(model);
      modelRef.current = model;

      // Calculate bounding box and auto-fit camera
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      centerOffsetRef.current.copy(center);

      // Position camera to fit model with some padding
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      const dist = maxDim / (2 * Math.tan(fov / 2)) * 1.6;

      camera.position.set(center.x, center.y, center.z + dist);
      camera.lookAt(center);

      setLoading(false);
    });

    // Animation
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      if (modelRef.current) {
        const center = centerOffsetRef.current;
        // Rotate around center
        modelRef.current.rotation.y = scrollProgress * Math.PI * 2;
        // Gentle float
        const time = Date.now() * 0.001;
        modelRef.current.position.y = Math.sin(time) * 0.005;
      }
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y = scrollProgress * Math.PI * 2;
    }
  }, [scrollProgress]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
