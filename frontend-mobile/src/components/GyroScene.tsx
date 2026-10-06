import { Canvas, useFrame } from '@react-three/fiber/native';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';
import { colors } from '@/theme';

export interface GyroVector {
  x: number;
  y: number;
}

interface SceneProps {
  gyroRef: MutableRefObject<GyroVector>;
}

function TherapyOrb({ gyroRef }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const alpha = 0.12;
    smooth.current.x = smooth.current.x * (1 - alpha) + gyroRef.current.x * alpha;
    smooth.current.y = smooth.current.y * (1 - alpha) + gyroRef.current.y * alpha;

    const targetX = THREE.MathUtils.clamp(smooth.current.x * 0.6, -0.9, 0.9);
    const targetY = THREE.MathUtils.clamp(smooth.current.y * 0.6, -0.9, 0.9);

    const lerp = Math.min(delta * 5, 1);

    if (groupRef.current) {
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * lerp;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * lerp;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
    }

    if (haloRef.current) {
      const t = Date.now() * 0.001;
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      haloRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Halo tipis (dalam) */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshBasicMaterial
          color={colors.accentTeal}
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Sphere utama — smooth, bukan flat */}
      <mesh>
        <sphereGeometry args={[0.7, 48, 48]} />
        <meshStandardMaterial
          color={colors.primary}
          roughness={0.15}
          metalness={0.6}
          emissive={colors.primary}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Wireframe halus — sebagai jaringan saraf */}
      <mesh>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshBasicMaterial
          color={colors.accentTeal}
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>

      {/* Satu ring tipis berputar */}
      <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.95, 0.008, 16, 120]} />
        <meshBasicMaterial
          color={colors.accentTeal}
          transparent
          opacity={0.55}
        />
      </mesh>

      {/* Titik kecil di atas (aksen) */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color={colors.accentTeal} />
      </mesh>
    </group>
  );
}

export function GyroScene({ gyroRef }: SceneProps) {
  return (
    <Canvas
      style={{ flex: 1 }}
      camera={{ position: [0, 0, 4.2], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 4]} intensity={1.1} />
      <directionalLight
        position={[-3, -2, 3]}
        intensity={0.5}
        color={colors.accentTeal}
      />
      <pointLight position={[0, 0, 2]} intensity={0.4} color={colors.primary} />

      <TherapyOrb gyroRef={gyroRef} />
    </Canvas>
  );
}