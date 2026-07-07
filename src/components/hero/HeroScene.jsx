import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  AdaptiveDpr,
  AdaptiveEvents,
  ContactShadows,
  Environment,
  Instance,
  Instances,
  Lightformer,
  RoundedBox,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';
import { AMBIENT, FILL_LIGHT, KEY_LIGHT, RIM_LIGHT } from '../../lib/lighting';
import { drawStudioScreen } from './screenTexture';

/**
 * The hero's 3D stage: a low-poly workstation, inspired by the reference
 * render — a glowing monitor ("RALEIGH, NC / WEBSITES"), a wooden
 * mechanical keyboard with cream + walnut keycaps, a wooden mouse, a
 * gold crystalline bonsai, drifting gold shards, gold light-streams
 * flowing from the screen, and a small wireframe node cluster.
 *
 * All lit-material geometry (no MeshTransmissionMaterial) — reliable
 * across browsers (Safari renders transmission black) and cheap. The
 * whole rig floats and parallaxes with pointer + scroll; the canvas
 * frameloop halts when the hero scrolls offscreen (see Hero.jsx).
 *
 * `motion` is a mutable ref-object ({ mouse:{x,y}, scroll }) — no React
 * re-renders on pointer/scroll.
 */

// Shared palette
const WOOD_DARK = '#43301F';
const WOOD = '#6E4C30';
const CREAM = '#ECE3D1';
const GOLD = '#E9B75C';
const GOLD_HOT = '#F5C86A';

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
      {/* Warm spill from the screen onto the keyboard + desk. */}
      <pointLight position={[0, 0.4, 0.4]} intensity={9} distance={9} decay={2} color="#FFC078" />
      {/* Studio panels baked once (no network) for wood/plastic reflections. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color="#FFF3E0" position={[-5, 6, 4]} rotation={[0, Math.PI / 4, 0]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#CFE2FF" position={[6, -1, 3]} rotation={[0, -Math.PI / 3, 0]} scale={[5, 3, 1]} />
        <Lightformer form="ring" intensity={1} color="#FFE9CE" position={[2, 6, -6]} scale={5} />
      </Environment>
    </>
  );
}

function Monitor() {
  const screenTex = useMemo(() => {
    const tex = new THREE.CanvasTexture(drawStudioScreen());
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

  return (
    <group position={[0, 0.55, -0.75]}>
      {/* Bezel */}
      <RoundedBox args={[4.35, 2.62, 0.12]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color="#1B211F" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      {/* Screen — self-illuminated so the headline glows */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[4.02, 2.32]} />
        <meshStandardMaterial
          map={screenTex}
          emissiveMap={screenTex}
          emissive="#ffffff"
          emissiveIntensity={0.9}
          roughness={0.5}
          metalness={0}
        />
      </mesh>
      {/* Stand */}
      <mesh position={[0, -1.5, -0.15]}>
        <boxGeometry args={[0.32, 0.7, 0.22]} />
        <meshStandardMaterial color="#202724" metalness={0.5} roughness={0.4} />
      </mesh>
      <RoundedBox args={[1.5, 0.12, 0.85]} radius={0.05} smoothness={3} position={[0, -1.9, -0.05]}>
        <meshStandardMaterial color="#202724" metalness={0.5} roughness={0.4} />
      </RoundedBox>
    </group>
  );
}

// Keycap layout, computed once.
function useKeyboardLayout() {
  return useMemo(() => {
    const cols = 14;
    const rows = 5;
    const pitchX = 0.3;
    const pitchZ = 0.34;
    const startX = -((cols - 1) * pitchX) / 2;
    const startZ = -((rows - 1) * pitchZ) / 2;
    // row-col pairs that hover above the board (the "lifting" keys)
    const floatSet = new Set(['1-9', '2-4', '3-11', '0-6', '2-12']);

    const keys = [];
    const floating = [];
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        // front row centre becomes the spacebar
        if (r === rows - 1 && c >= 4 && c <= 9) continue;
        const x = startX + c * pitchX;
        const z = startZ + r * pitchZ;
        const isEdge = c === 0 || c === cols - 1 || r === 0;
        const hash = ((r * cols + c) * 7) % 13;
        const wood = isEdge || hash === 0 || hash === 5;
        const key = { pos: [x, 0.23, z], color: wood ? WOOD : CREAM };
        if (floatSet.has(`${r}-${c}`)) {
          floating.push({ ...key, phase: Math.random() * 6.28, speed: 0.9 + Math.random() * 0.8 });
        } else {
          keys.push(key);
        }
      }
    }
    // Spacebar (a wide-scaled instance) on the front row.
    keys.push({ pos: [0, 0.23, startZ + (rows - 1) * pitchZ], color: CREAM, scale: [6, 1, 1] });
    return { keys, floating };
  }, []);
}

function Keyboard({ layout }) {
  const floatRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    layout.floating.forEach((k, i) => {
      const m = floatRefs.current[i];
      if (!m) return;
      m.position.y = k.pos[1] + 0.14 + Math.sin(t * k.speed + k.phase) * 0.05;
      m.rotation.z = Math.sin(t * k.speed * 0.7 + k.phase) * 0.12;
    });
  });

  return (
    <group position={[0, -1.28, 1.5]} rotation={[0.16, 0, 0]}>
      {/* Walnut tray */}
      <RoundedBox args={[4.6, 0.24, 1.95]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color={WOOD_DARK} roughness={0.55} metalness={0.1} />
      </RoundedBox>
      {/* Recessed plate */}
      <RoundedBox args={[4.25, 0.06, 1.6]} radius={0.03} smoothness={2} position={[0, 0.12, 0]}>
        <meshStandardMaterial color="#2E2116" roughness={0.7} />
      </RoundedBox>
      {/* Static keycaps (instanced, per-instance colour) */}
      <Instances limit={layout.keys.length} castShadow>
        <boxGeometry args={[0.26, 0.22, 0.26]} />
        <meshStandardMaterial roughness={0.5} metalness={0.05} />
        {layout.keys.map((k, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Instance key={i} position={k.pos} color={k.color} scale={k.scale || 1} />
        ))}
      </Instances>
      {/* Hovering keys */}
      {layout.floating.map((k, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <mesh key={i} ref={(el) => { floatRefs.current[i] = el; }} position={k.pos}>
          <boxGeometry args={[0.26, 0.22, 0.26]} />
          <meshStandardMaterial color={k.color} roughness={0.5} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

function Mouse() {
  return (
    <group position={[3.0, -1.42, 1.55]} rotation={[0, -0.15, 0]}>
      <mesh scale={[0.55, 0.4, 0.9]}>
        <sphereGeometry args={[0.5, 20, 16]} />
        <meshStandardMaterial color={WOOD} roughness={0.45} metalness={0.15} />
      </mesh>
      {/* scroll-wheel seam */}
      <mesh position={[0, 0.16, 0.18]}>
        <boxGeometry args={[0.04, 0.06, 0.16]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Bonsai() {
  const group = useRef();
  useFrame((state) => {
    if (group.current) group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
  });

  // Gold foliage pads: clusters of small icosahedrons.
  const pads = useMemo(() => {
    const centres = [
      [0.25, 0.78, 0],
      [-0.22, 0.72, 0.06],
      [0.04, 0.98, -0.05],
    ];
    const out = [];
    centres.forEach((ctr) => {
      for (let i = 0; i < 6; i += 1) {
        out.push([
          ctr[0] + (Math.random() - 0.5) * 0.34,
          ctr[1] + (Math.random() - 0.5) * 0.22,
          ctr[2] + (Math.random() - 0.5) * 0.34,
          0.09 + Math.random() * 0.06,
        ]);
      }
    });
    return out;
  }, []);

  return (
    <group ref={group} position={[-3.25, 0.2, 0.2]}>
      {/* Amber crystal pot */}
      <RoundedBox args={[0.82, 0.5, 0.62]} radius={0.07} smoothness={3} position={[0, -0.35, 0]}>
        <meshStandardMaterial color="#D89A44" roughness={0.18} metalness={0.15} emissive="#5A3410" emissiveIntensity={0.2} />
      </RoundedBox>
      {/* Trunk segments */}
      <mesh position={[0, 0.12, 0]} rotation={[0, 0, 0.08]}>
        <cylinderGeometry args={[0.05, 0.1, 0.75, 6]} />
        <meshStandardMaterial color="#5A3E28" roughness={0.85} />
      </mesh>
      <mesh position={[0.16, 0.55, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.035, 0.06, 0.5, 6]} />
        <meshStandardMaterial color="#5A3E28" roughness={0.85} />
      </mesh>
      <mesh position={[-0.14, 0.5, 0.04]} rotation={[0, 0, 0.7]}>
        <cylinderGeometry args={[0.03, 0.05, 0.42, 6]} />
        <meshStandardMaterial color="#5A3E28" roughness={0.85} />
      </mesh>
      {/* Gold canopy */}
      {pads.map((p, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <icosahedronGeometry args={[p[3], 0]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD_HOT} emissiveIntensity={0.45} roughness={0.35} metalness={0.35} />
        </mesh>
      ))}
    </group>
  );
}

function GoldShards() {
  const group = useRef();
  const shards = useMemo(
    () =>
      Array.from({ length: 16 }, () => ({
        pos: [
          (Math.random() - 0.5) * 6.5,
          -1.2 + Math.random() * 2.8,
          -0.8 + Math.random() * 2.4,
        ],
        scale: 0.05 + Math.random() * 0.09,
        rot: [Math.random() * 3, Math.random() * 3, Math.random() * 3],
      })),
    []
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = t * 0.05;
    g.position.y = Math.sin(t * 0.4) * 0.06;
  });

  return (
    <group ref={group}>
      <Instances limit={shards.length}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={GOLD} emissive={GOLD_HOT} emissiveIntensity={0.4} roughness={0.3} metalness={0.5} />
        {shards.map((s, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Instance key={i} position={s.pos} scale={s.scale} rotation={s.rot} />
        ))}
      </Instances>
    </group>
  );
}

/** Gold particles flowing along curves from the screen down to the keys. */
function LightStreams() {
  const ref = useRef();
  const { curves, perCurve, total, positions } = useMemo(() => {
    const cs = [
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0.4, 0.7, -0.5),
        new THREE.Vector3(1.6, 0.2, 0.6),
        new THREE.Vector3(0.8, -0.9, 1.2),
        new THREE.Vector3(-0.2, -1.15, 1.5)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(-0.3, 0.6, -0.5),
        new THREE.Vector3(-1.8, 0.1, 0.4),
        new THREE.Vector3(-1.2, -0.9, 1.0),
        new THREE.Vector3(0.2, -1.15, 1.5)
      ),
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(0.1, 0.9, -0.5),
        new THREE.Vector3(0.3, -0.2, 0.9),
        new THREE.Vector3(0.1, -0.8, 1.3),
        new THREE.Vector3(0.0, -1.15, 1.6)
      ),
    ];
    const per = 34;
    const tot = per * cs.length;
    return { curves: cs, perCurve: per, total: tot, positions: new Float32Array(tot * 3) };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const geo = ref.current;
    if (!geo) return;
    const arr = geo.attributes.position.array;
    for (let c = 0; c < curves.length; c += 1) {
      for (let i = 0; i < perCurve; i += 1) {
        const idx = c * perCurve + i;
        const p = ((i / perCurve + t * 0.12 + c * 0.13) % 1 + 1) % 1;
        const v = curves[c].getPoint(p);
        arr[idx * 3] = v.x;
        arr[idx * 3 + 1] = v.y;
        arr[idx * 3 + 2] = v.z;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={ref}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={total} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color="#FFCB7A"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Small wireframe node cluster, echoing the reference's molecule motif. */
function NodeCluster() {
  const group = useRef();
  const { nodes, lineGeo } = useMemo(() => {
    const pts = Array.from({ length: 6 }, () => [
      (Math.random() - 0.5) * 0.9,
      (Math.random() - 0.5) * 0.9,
      (Math.random() - 0.5) * 0.9,
    ]);
    const segs = [];
    for (let i = 0; i < pts.length; i += 1) {
      for (let j = i + 1; j < pts.length; j += 1) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 0.8) {
          segs.push(...pts[i], ...pts[j]);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(segs, 3));
    return { nodes: pts, lineGeo: g };
  }, []);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <group ref={group} position={[-3.1, -1.05, 1.0]} scale={0.9}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.5} />
      </lineSegments>
      {nodes.map((p, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD_HOT} emissiveIntensity={0.5} metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function DeskRig({ motion }) {
  const group = useRef();
  const layout = useKeyboardLayout();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const { mouse, scroll } = motion.current;
    const dt = Math.min(delta, 0.05);

    // Cinematic settle: rises out of the glow and eases into idle float.
    const settle = 1 - THREE.MathUtils.smoothstep(t, 0.3, 2.0);

    const targetRotY = mouse.x * 0.12 + Math.sin(t * 0.3) * 0.02 - settle * 0.25;
    const targetRotX = -mouse.y * 0.06 + scroll * 0.3 + settle * 0.14;
    const targetY = -0.05 + Math.sin(t * 0.6) * 0.03 + scroll * 1.0 - settle * 0.5;
    const targetZ = -scroll * 1.4 - settle * 1.0;

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 4, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 4, dt);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetZ, 4, dt);
  });

  return (
    <group ref={group} position={[0, 0.1, 0]} scale={0.82}>
      <Monitor />
      <Keyboard layout={layout} />
      <Mouse />
      <Bonsai />
      <GoldShards />
      <LightStreams />
      <NodeCluster />
    </group>
  );
}

export default function HeroScene({ motion, active = true }) {
  return (
    <Canvas
      // frameloop halts when the hero scrolls offscreen (see Hero.jsx),
      // so the scene costs nothing while the rest of the page is read.
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      camera={{ position: [0, 1.1, 9.8], fov: 32 }}
      onCreated={({ camera }) => camera.lookAt(0, -0.35, 0.3)}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
    >
      <Suspense fallback={null}>
        <Lights />
        <DeskRig motion={motion} />
        {/* Faint gold dust in the air */}
        <Sparkles count={22} scale={[8, 4.5, 4]} position={[0, 0, 0]} size={3} speed={0.3} opacity={0.6} color="#F5C86A" />
        {/* Ground contact shadow under the whole desk */}
        <ContactShadows position={[0, -2.0, 0.4]} opacity={0.3} scale={11} blur={2.6} far={4} color="#2A2214" />
        <AdaptiveDpr pixelated={false} />
        <AdaptiveEvents />
      </Suspense>
    </Canvas>
  );
}
