import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  AdaptiveDpr,
  AdaptiveEvents,
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  MeshTransmissionMaterial,
  RoundedBox,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';
import { AMBIENT, FILL_LIGHT, KEY_LIGHT, RIM_LIGHT } from '../../lib/lighting';

/**
 * The hero's 3D stage, rebuilt to the liquid-glass reference boards:
 * a refractive crystal tower wrapped by a tilted glass ring, floating
 * over the silver grid with prismatic blobs glowing through the glass.
 *
 * - Tower + ring use MeshTransmissionMaterial: real refraction with
 *   chromatic aberration, so edges break light into the same rainbow
 *   the reference crystal shows.
 * - The colored blobs are in-scene billboard sprites (soft radial
 *   gradients) so the transmission buffer refracts them through the
 *   glass — that's the reference's signature read.
 * - Two frosted capsule slices float behind, echoing the exploded
 *   pill stack of the first board.
 * - Lighting comes from the shared rig in src/lib/lighting.js (white
 *   key upper-left, blue fill, faint amber kicker).
 *
 * `motion` is a mutable ref-object ({ mouse: {x,y}, scroll }) written by
 * the Hero component — no React re-renders on pointer/scroll.
 */

const PAGE_BG = '#DFE1E5';

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
      {/* White studio panels baked once to a cubemap (no network) — the
          glass needs bright shapes to refract and sparkle against. */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={4}
          color="#FFFFFF"
          position={[-5, 6, 4]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[10, 2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#CFE2FF"
          position={[6, -1, 3]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[5, 3, 1]}
        />
        <Lightformer
          form="ring"
          intensity={1.2}
          color="#FFE9CE"
          position={[2, 6, -6]}
          scale={5}
        />
        {/* Two thin grazing strips — these are what the crystal facets
            catch as sharp glints. */}
        <Lightformer
          form="rect"
          intensity={6}
          color="#FFFFFF"
          position={[-3, 2, 6]}
          rotation={[0, 0.4, -0.5]}
          scale={[7, 0.3, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3}
          color="#DFF3FF"
          position={[4, 4, -2]}
          rotation={[0, -0.6, 0.4]}
          scale={[5, 0.25, 1]}
        />
      </Environment>
    </>
  );
}

/** Soft radial-gradient sprite texture for the prismatic blobs. */
function makeBlobTexture(color) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, color);
  g.addColorStop(1, `${color}00`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const BLOBS = [
  { color: '#35C8E8', position: [0.9, 0.7, -2.4], scale: 3.4, opacity: 0.85 },
  { color: '#3E6FF0', position: [-1.4, -0.4, -2.8], scale: 3, opacity: 0.7 },
  { color: '#8B7CF7', position: [2.2, -0.9, -3.2], scale: 2.6, opacity: 0.6 },
  { color: '#F0A8C8', position: [-0.4, -1.2, -2.2], scale: 2, opacity: 0.55 },
  { color: '#E8B06A', position: [1.6, -1.5, -2.6], scale: 1.6, opacity: 0.45 },
];

function Blobs() {
  const textures = useMemo(() => BLOBS.map((b) => makeBlobTexture(b.color)), []);
  const group = useRef();
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      child.position.y = BLOBS[i].position[1] + Math.sin(t * 0.25 + i * 1.7) * 0.18;
      child.position.x = BLOBS[i].position[0] + Math.cos(t * 0.2 + i * 2.1) * 0.12;
    });
  });
  return (
    <group ref={group}>
      {BLOBS.map((b, i) => (
        <mesh key={b.color} position={b.position} scale={b.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={textures[i]}
            transparent
            opacity={b.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// One shared transmission background color object — avoids allocating a
// new THREE.Color on every render of every crystal material.
const TRANSMISSION_BG = new THREE.Color(PAGE_BG);

/**
 * Shared transmission look for the crystal pieces. Tuned for cost:
 * a 256px refraction buffer with 4 samples reads identically to 512/6
 * at this on-screen size, and temporalDistortion is dropped (it forced
 * a per-frame noise-buffer update for a barely-visible shimmer).
 */
function CrystalMaterial({ tint = '#EAF2F8', aberration = 0.5, ...props }) {
  return (
    <MeshTransmissionMaterial
      background={TRANSMISSION_BG}
      transmission={1}
      samples={4}
      resolution={256}
      thickness={1.9}
      ior={1.52}
      roughness={0.04}
      chromaticAberration={aberration}
      anisotropicBlur={0.06}
      distortion={0.1}
      distortionScale={0.35}
      temporalDistortion={0}
      clearcoat={1}
      iridescence={0.3}
      iridescenceIOR={1.3}
      attenuationDistance={1.5}
      attenuationColor="#BFE0F5"
      color={tint}
      {...props}
    />
  );
}

function GlassSculpture({ motion }) {
  const group = useRef();
  const ring = useRef();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { mouse, scroll } = motion.current;
    const dt = Math.min(delta, 0.05);

    // Cinematic settle: rises out of the glow and eases into idle spin.
    const intro = THREE.MathUtils.smoothstep(t, 0.3, 2.2);
    const settle = 1 - intro;

    const targetRotY = t * 0.22 + mouse.x * 0.3 - settle * 0.8;
    const targetRotX = -mouse.y * 0.12 + scroll * 0.4 + settle * 0.18;
    const targetY = -0.15 + Math.sin(t * 0.7) * 0.07 + scroll * 1.1 - settle * 0.6;
    const targetZ = -scroll * 1.6 - settle * 1.2;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 4, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 4, dt);

    if (ring.current) {
      ring.current.rotation.z = Math.sin(t * 0.3) * 0.12;
    }
  });

  return (
    <group ref={group} position={[0, -0.75, -1.2]} rotation={[0.18, -0.8, 0]}>
      {/* Crystal tower — beveled edges so the grazing env strips read
          as sharp facet glints running down the monolith */}
      <RoundedBox args={[1.3, 2.7, 1.3]} radius={0.07} smoothness={4}>
        <CrystalMaterial tint="#DCEBF8" aberration={0.9} />
      </RoundedBox>
      {/* Tilted glass ring, orbiting the tower like the reference */}
      <group ref={ring} rotation={[1.32, 0.12, 0.35]}>
        <mesh>
          <torusGeometry args={[1.95, 0.24, 20, 96]} />
          <CrystalMaterial
            tint="#F2ECF8"
            aberration={1}
            thickness={0.9}
            iridescence={0.9}
            iridescenceIOR={1.35}
          />
        </mesh>
      </group>
    </group>
  );
}

/** Small crystal shards orbiting the sculpture — polished solid gems.
 *  (Deliberately NOT transmissive: the renderer's shared transmission
 *  pass samples the transparent canvas background and rims transparent
 *  meshes with dark edges. Env-driven gloss + full iridescence reads
 *  crystalline without the artifact.) */
const SHARDS = [
  { position: [-1.95, 1.35, -0.6], size: 0.19, speed: 1.6 },
  { position: [2.15, 1.05, -1.0], size: 0.23, speed: 1.2 },
  { position: [-2.45, -1.05, -0.3], size: 0.16, speed: 1.9 },
  { position: [1.75, -1.35, 0.2], size: 0.14, speed: 2.2 },
  { position: [0.45, 1.8, -1.4], size: 0.12, speed: 1.4 },
];

function CrystalShards() {
  return (
    <>
      {SHARDS.map((s) => (
        <Float
          key={s.position.join(',')}
          speed={s.speed}
          rotationIntensity={2.2}
          floatIntensity={1.2}
        >
          <mesh position={s.position}>
            <octahedronGeometry args={[s.size, 0]} />
            <meshPhysicalMaterial
              color="#C9DEF6"
              metalness={0.15}
              roughness={0.06}
              iridescence={1}
              iridescenceIOR={1.45}
              clearcoat={1}
              clearcoatRoughness={0.06}
              envMapIntensity={2}
              specularIntensity={1.2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

/** Two frosted capsule slices floating behind — the exploded pill stack
 *  from the first reference board, fully lit by the same rig. */
function FrostedPills() {
  return (
    <>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.4}>
        <RoundedBox
          args={[1.15, 2.3, 0.1]}
          radius={0.55}
          smoothness={4}
          position={[-2.5, 0.2, -1.8]}
          rotation={[0.02, 0.5, -0.03]}
        >
          <meshPhysicalMaterial
            color="#F6FAFD"
            transparent
            opacity={0.55}
            roughness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.2}
            envMapIntensity={1.1}
          />
        </RoundedBox>
      </Float>
      <Float speed={0.9} rotationIntensity={0.15} floatIntensity={0.5}>
        <RoundedBox
          args={[1.05, 2.1, 0.1]}
          radius={0.5}
          smoothness={4}
          position={[2.6, -0.3, -2.2]}
          rotation={[-0.02, -0.45, 0.03]}
        >
          <meshPhysicalMaterial
            color="#F2F8FC"
            transparent
            opacity={0.5}
            roughness={0.4}
            clearcoat={1}
            clearcoatRoughness={0.25}
            envMapIntensity={1}
          />
        </RoundedBox>
      </Float>
    </>
  );
}

export default function HeroScene({ motion, active = true }) {
  return (
    <Canvas
      // frameloop stops entirely when the hero scrolls out of view, so the
      // two transmission passes cost nothing while the rest of the page is
      // read. AdaptiveDpr drops resolution under load and restores it when
      // idle, so a slow GPU degrades gracefully instead of stuttering.
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      camera={{ position: [0, 0.25, 7.2], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Lights />
        <Blobs />
        <GlassSculpture motion={motion} />
        <CrystalShards />
        <FrostedPills />
        {/* Airborne glints drifting through the scene */}
        <Sparkles
          count={24}
          scale={[7.5, 4.2, 4]}
          position={[0, -0.1, -1]}
          size={4}
          speed={0.32}
          opacity={0.75}
          color="#3E6FF0"
        />
        {/* Soft slate ground shadow with real falloff, floating the
            sculpture just above the page like the reference render. */}
        <ContactShadows
          position={[0, -1.85, 0]}
          opacity={0.22}
          scale={7}
          blur={2.6}
          far={3.2}
          color="#2A3A5C"
        />
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
      </Suspense>
    </Canvas>
  );
}
