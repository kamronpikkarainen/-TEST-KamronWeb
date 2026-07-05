import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, MeshReflectorMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { AMBIENT, FILL_LIGHT, KEY_LIGHT, RIM_LIGHT } from '../../lib/lighting';
import { drawGreenEdgeScreen } from './screenTexture';

/**
 * The hero's 3D stage: a floating low-poly browser window running the
 * GreenEdge Lawn Co. site, sitting in one coherently lit scene.
 *
 * The lighting story (single source of truth: src/lib/lighting.js):
 * - one warm KEY from the upper-left — it puts the specular streak on
 *   the browser's clearcoat chrome and defines every highlight
 * - a cool FILL from the lower-right so the shadow side keeps detail
 *   instead of going black
 * - a white RIM from behind-right to cut the silhouette off the dark
 * The ground is a real reflective floor (blurred, mostly-rough) plus a
 * depth-based ContactShadows pass — actual falloff, not a CSS blur.
 * Scene fog matches the page background so the floor dissolves into
 * the page with no horizon line.
 *
 * `motion` is a mutable ref-object ({ mouse: {x,y}, scroll }) written by
 * the Hero component — no React re-renders on pointer/scroll, everything
 * is consumed inside useFrame.
 */

const PAGE_BG = '#0A0D12';
const FLOOR_Y = -1.62;

function Lights() {
  return (
    <>
      <ambientLight intensity={AMBIENT.intensity} color={AMBIENT.color} />
      <directionalLight
        position={KEY_LIGHT.position}
        intensity={KEY_LIGHT.intensity}
        color={KEY_LIGHT.color}
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
      {/* Device body. Clearcoat over brushed metal: the rounded top bevel
          catches the warm key light as a soft specular streak. */}
      <RoundedBox args={[3.44, 2.32, 0.14]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color="#1b232e"
          metalness={0.7}
          roughness={0.32}
          clearcoat={1}
          clearcoatRoughness={0.22}
        />
      </RoundedBox>
      {/* Screen — self-illuminated like a real display, so the lit page
          reads even on the shadow side of the pose. */}
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[3.2, 2.08]} />
        <meshStandardMaterial
          map={screenTexture}
          emissiveMap={screenTexture}
          emissive="#ffffff"
          emissiveIntensity={0.32}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
      {/* Thin accent light-strip along the bottom edge — it also shows up
          in the floor reflection, which sells the contact. */}
      <mesh position={[0, -1.19, 0]}>
        <boxGeometry args={[3.3, 0.015, 0.1]} />
        <meshStandardMaterial
          color="#A8F04B"
          emissive="#A8F04B"
          emissiveIntensity={0.8}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

/**
 * Two dark glass slabs floating behind the browser. Fully committed 3D:
 * opaque physical material with real thickness, lit by the same rig —
 * the key light grazes their top bevels exactly like the mockup's.
 */
function BackdropSlabs() {
  return (
    <>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.35}>
        <RoundedBox
          args={[1.9, 1.25, 0.07]}
          radius={0.035}
          smoothness={3}
          position={[-2.25, 0.85, -1.7]}
          rotation={[0.04, 0.42, -0.02]}
        >
          <meshPhysicalMaterial
            color="#121924"
            metalness={0.65}
            roughness={0.38}
            clearcoat={0.7}
            clearcoatRoughness={0.3}
          />
        </RoundedBox>
      </Float>
      <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.45}>
        <RoundedBox
          args={[2.1, 1.4, 0.07]}
          radius={0.035}
          smoothness={3}
          position={[2.55, -0.2, -2.1]}
          rotation={[-0.03, 0.18, 0.02]}
        >
          <meshPhysicalMaterial
            color="#0f151e"
            metalness={0.65}
            roughness={0.4}
            clearcoat={0.7}
            clearcoatRoughness={0.3}
          />
        </RoundedBox>
      </Float>
    </>
  );
}

/**
 * The floor: a mostly-rough reflector that carries a blurred, distance-
 * faded reflection of the mockup. Fog (matched to the page background)
 * dissolves its far edge, so there's no horizon line — the scene just
 * fades into the page.
 */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y, -3]}>
      <planeGeometry args={[34, 26]} />
      <MeshReflectorMaterial
        resolution={512}
        blur={[300, 80]}
        mixBlur={0.9}
        mixStrength={0.8}
        mirror={0.45}
        depthScale={1}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.2}
        color="#0b0f16"
        metalness={0}
        roughness={1}
      />
    </mesh>
  );
}

export default function HeroScene({ motion }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      // Camera rides low, near floor level — a product-shot angle that
      // keeps the contact shadow + reflection in frame and gives the
      // floor reflection a strong grazing angle.
      camera={{ position: [0, -0.55, 6.8], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      {/* Fog matched to the page bg — the floor's far reaches render as
          exactly the page color, so the scene has no visible edges. */}
      <fog attach="fog" args={[PAGE_BG, 8.5, 17]} />
      <Suspense fallback={null}>
        <Lights />
        <BrowserMockup motion={motion} />
        <BackdropSlabs />
        <Ground />
        {/* Depth-based contact shadow — soft core under the mockup with
            real falloff, layered just above the reflective floor. */}
        <ContactShadows
          position={[0, FLOOR_Y + 0.01, 0]}
          opacity={0.62}
          scale={9}
          blur={2.4}
          far={3.4}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
