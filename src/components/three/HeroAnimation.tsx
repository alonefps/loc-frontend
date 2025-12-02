'use client';

import { useRef, useEffect, useState } from 'react';

export function HeroAnimation() {
  const [Canvas, setCanvas] = useState<any>(null);
  const [fiber, setFiber] = useState<any>(null);
  const [drei, setDrei] = useState<any>(null);
  const [THREE, setTHREE] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import('@react-three/fiber'),
      import('@react-three/drei'),
      import('three'),
    ]).then(([fiberModule, dreiModule, threeModule]) => {
      setCanvas(() => fiberModule.Canvas);
      setFiber(fiberModule);
      setDrei(dreiModule);
      setTHREE(threeModule);
    });
  }, []);

  if (!Canvas || !fiber || !drei || !THREE) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse rounded-3xl" />
    );
  }

  const AnimatedSphere = () => {
    const meshRef = useRef<any>(null);

    fiber.useFrame((state: any) => {
      if (meshRef.current) {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      }
    });

    return (
      <drei.Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
        <drei.MeshDistortMaterial
          color="#667eea"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </drei.Sphere>
    );
  };

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <AnimatedSphere />
        <drei.OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}

