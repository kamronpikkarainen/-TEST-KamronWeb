import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { AMBIENT, FILL_LIGHT, KEY_LIGHT, RIM_LIGHT } from '../../lib/lighting';
import { drawGreenEdgeScreen } from './screenTexture';

/**
 * The hero's 3D stage: a floating low-poly browser window running the
 * GreenEdge Lawn Co. site, lit by the page's single shared lighting rig.
 *
 * `motion` is a mutable ref-object ({ mouse: {x,y}, scroll }) written by
 * the Hero component — no React re-renders on pointer/scroll, everything
 * is consumed inside useFrame.
 */

function Lights() {
  return (
    <>
      <ambientLight intensity={AMBIENT.intensity} color={AMBIENT.color} />
      <directionalLight
        position={KEY_LIGHT.position}
        intensity={KEY_LIGHT.intensity}
        color={KEY_LIGHT.color}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={FILL_LIGHT.position}
        intensity={FILL_LIGHT.intensity}
        color={FILL_LIGHT.color}
      />
      <directionalLight
        position={RIM_LIGHT.position}
        intensity={RIM_LIGHT.intensity}
        color={RIM_LIGHT.color}
      />
    </>
  );
}

function BrowserMockup({ motion }) {
  const group = useRef();
  const screenTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(drawGreenEdgeScreen());
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { mouse, scroll } = motion.current;
    const dt = Math.min(delta, 0.05);

    // Idle drift + mouse parallax + scroll recede, blended into one pose.
    const targetRotY = Math.sin(t * 0.32) * 0.09 + mouse.x * 0.22;
    const targetRotX =
      Math.cos(t * 0.27) * 0.035 - mouse.y * 0.14 + scroll * 0.55;
    const targetY = -0.25 + Math.sin(t * 0.8) * 0.06 + scroll * 1.1;
    const targetZ = -scroll * 1.6;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 4, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 4, dt);
  });

  return (
    <group ref={group} position={[0, -0.25, 0]}>
      {/* Device body — low-poly rounded slab */}
      <RoundedBox args={[3.44, 2.32, 0.14]} radius={0.055} smoothness={3} castShadow>
        <meshStandardMaterial color="#1a212b" metalness={0.55} roughness={0.38} />
      </RoundedBox>
      {/* Screen */}
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[3.2, 2.08]} />
        <meshStandardMaterial map={screenTexture} roughness={0.9} metalness={0} />
      </mesh>
      {/* Thin accent light-strip along the bottom edge */}
      <mesh position={[0, -1.19, 0]}>
        <boxGeometry args={[3.3, 0.015, 0.1]} />
        <meshStandardMaterial
          color="#A8F04B"
          emissive="#A8F04B"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

/** Dim glass panes and accents floating behind the browser for depth. */
function BackdropShapes() {
  return (
    <>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[-2.2, 0.9, -1.6]} rotation={[0.05, 0.5, 0]}>
          <planeGeometry args={[1.9, 1.25]} />
          <meshStandardMaterial
            color="#141c26"
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
      <Float speed={0.9} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[2.4, -0.7, -2]} rotation={[-0.08, -0.55, 0]}>
          <planeGeometry args={[2.1, 1.4]} />
          <meshStandardMaterial
            color="#101720"
            metalness={0.6}
            roughness={0.3}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh position={[2.35, 1.25, -0.9]}>
          <torusGeometry args={[0.26, 0.075, 12, 36]} />
          <meshStandardMaterial color="#2a3543" metalness={0.75} roughness={0.25} />
        </mesh>
      </Float>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh position={[-2.55, -1.05, -0.6]}>
          <icosahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial
            color="#A8F04B"
            emissive="#A8F04B"
            emissiveIntensity={0.35}
            metalness={0.2}
            roughness={0.35}
          />
        </mesh>
      </Float>
    </>
  );
}

export default function HeroScene({ motion }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      shadows
      camera={{ position: [0, 0.15, 6.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Lights />
        <BrowserMockup motion={motion} />
        <BackdropShapes />
        <ContactShadows
          position={[0, -1.75, 0]}
          opacity={0.6}
          scale={10}
          blur={2.8}
          far={3.2}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
