import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  MeshReflectorMaterial,
  RoundedBox,
} from '@react-three/drei';
import * as THREE from 'three';
import { AMBIENT, FILL_LIGHT, KEY_LIGHT, RIM_LIGHT } from '../../lib/lighting';
import { drawGreenEdgeScreen } from './screenTexture';

/**
 * The hero's 3D stage: a floating low-poly browser window running the
 * GreenEdge Lawn Co. site, shot like a studio product photo.
 *
 * The lighting story (single source of truth: src/lib/lighting.js):
 * - one warm KEY spotlight from the upper-left. Being a spot (inverse-
 *   square falloff), it paints a natural pool of light on the floor and
 *   puts the specular streak on the browser's clearcoat chrome
 * - a cool FILL from the lower-right keeps the shadow side readable
 * - a white RIM from behind-right cuts the silhouette off the dark
 * - a static procedural Environment (three soft studio panels, baked
 *   once to a cubemap — no network fetch) gives the metals real
 *   reflection content instead of bare punctual-light dots
 *
 * The ground is a blurred reflective floor plus a depth-based
 * ContactShadows pass — actual falloff, not a CSS blur. Scene fog is
 * matched to the page background so the floor dissolves into the page
 * with no horizon line.
 *
 * `motion` is a mutable ref-object ({ mouse: {x,y}, scroll }) written by
 * the Hero component — no React re-renders on pointer/scroll, everything
 * is consumed inside useFrame.
 */

const PAGE_BG = '#0A0D12';
const FLOOR_Y = -1.62;

function Lights() {
  const spotTarget = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, -1.1, 0);
    return o;
  }, []);

  return (
    <>
      <ambientLight intensity={AMBIENT.intensity} color={AMBIENT.color} />
      <primitive object={spotTarget} />
      <spotLight
        position={KEY_LIGHT.position}
        intensity={KEY_LIGHT.intensity}
        color={KEY_LIGHT.color}
        angle={KEY_LIGHT.angle}
        penumbra={KEY_LIGHT.penumbra}
        decay={KEY_LIGHT.decay}
        target={spotTarget}
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
      {/* Studio reflection content, baked once (frames={1}). The big warm
          strip sits where the key light lives, so the chrome's specular
          streak and the light direction agree. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={5}
          color="#FFD9A8"
          position={[-5, 6, 4]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[9, 1.6, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#BCD3FF"
          position={[6, -1, 3]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[4, 3, 1]}
        />
        <Lightformer
          form="ring"
          intensity={0.8}
          color="#ffffff"
          position={[2, 6, -6]}
          scale={5}
        />
      </Environment>
    </>
  );
}

/** Diagonal glass-reflection streak texture for the screen, drawn to
 *  agree with the upper-left key. */
function makeStreakTexture() {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, 'rgba(255, 226, 188, 0.55)');
  grad.addColorStop(0.16, 'rgba(255, 226, 188, 0.10)');
  grad.addColorStop(0.34, 'rgba(255, 226, 188, 0)');
  grad.addColorStop(0.8, 'rgba(188, 211, 255, 0)');
  grad.addColorStop(1, 'rgba(188, 211, 255, 0.06)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function BrowserMockup({ motion }) {
  const group = useRef();
  const screenTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(drawGreenEdgeScreen());
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
  const streakTexture = useMemo(makeStreakTexture, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { mouse, scroll } = motion.current;
    const dt = Math.min(delta, 0.05);

    // Cinematic settle: for the first ~2s the mockup glides up out of
    // the fog, tilted back, and eases into its resting float.
    const intro = THREE.MathUtils.smoothstep(t, 0.3, 2.2);
    const settle = 1 - intro;

    // Idle drift + mouse parallax + scroll recede, blended into one pose.
    const targetRotY = Math.sin(t * 0.32) * 0.09 + mouse.x * 0.22 - settle * 0.3;
    const targetRotX =
      Math.cos(t * 0.27) * 0.035 - mouse.y * 0.14 + scroll * 0.55 + settle * 0.24;
    const targetY = -0.25 + Math.sin(t * 0.8) * 0.06 + scroll * 1.1 - settle * 0.5;
    const targetZ = -scroll * 1.6 - settle * 1.5;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 4, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 4, dt);
  });

  return (
    <group ref={group} position={[0, -0.75, -1.5]} rotation={[0.24, -0.3, 0]}>
      {/* Device body. Clearcoat over brushed metal: the rounded top bevel
          catches the warm key light as a soft specular streak, and the
          Environment strip gives the metal something real to reflect. */}
      <RoundedBox args={[3.44, 2.32, 0.14]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color="#212b37"
          metalness={0.7}
          roughness={0.32}
          clearcoat={1}
          clearcoatRoughness={0.22}
          envMapIntensity={0.9}
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
      {/* Glass over the screen: a faint diagonal streak from the key's
          direction — additive, so it reads as reflection, not paint. */}
      <mesh position={[0, 0, 0.078]}>
        <planeGeometry args={[3.2, 2.08]} />
        <meshBasicMaterial
          map={streakTexture}
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
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
            envMapIntensity={0.7}
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
            envMapIntensity={0.7}
          />
        </RoundedBox>
      </Float>
    </>
  );
}

/** A few warm dust motes drifting through the key light — gives the air
 *  volume without reading as a particle effect. */
function Dust() {
  const points = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(44 * 3);
    for (let i = 0; i < 44; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = FLOOR_Y + 0.1 + Math.random() * 2.8;
      arr[i * 3 + 2] = -2.5 + Math.random() * 3.5;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const p = points.current;
    if (!p) return;
    const t = state.clock.elapsedTime;
    p.rotation.y = t * 0.016;
    p.position.y = Math.sin(t * 0.18) * 0.08;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#FFD9A8"
        transparent
        opacity={0.32}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
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
        blur={[280, 70]}
        mixBlur={0.9}
        mixStrength={0.85}
        mirror={0.5}
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
        <Dust />
        <Ground />
        {/* Depth-based contact shadow — soft core under the mockup with
            real falloff, layered just above the reflective floor. */}
        <ContactShadows
          position={[0, FLOOR_Y + 0.01, 0]}
          opacity={0.7}
          scale={9}
          blur={2.4}
          far={3.4}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}
