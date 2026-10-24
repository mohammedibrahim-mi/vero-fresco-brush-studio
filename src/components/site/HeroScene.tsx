import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import heroImg from "@/assets/hero-phone.jpg";

const COLORS = ["#FE3600", "#FAD220", "#81DA42", "#318EFF", "#8B68E8"];

const vert = /* glsl */ `
  varying vec2 vUv; varying vec3 vN;
  void main(){ vUv = uv; vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const frag = /* glsl */ `
  uniform vec3 uColor; uniform float uTime; uniform float uProgress;
  varying vec2 vUv; varying vec3 vN;
  void main(){
    if (vUv.x > uProgress) discard;
    float l = clamp(dot(vN, normalize(vec3(0.4,0.8,0.6))), 0.0, 1.0);
    float flow = 0.5 + 0.5 * sin(vUv.x * 28.0 - uTime * 2.4);
    vec3 c = uColor * (0.62 + 0.45 * l) + vec3(0.18) * pow(flow, 6.0);
    float spec = pow(l, 24.0) * 0.5;
    gl_FragColor = vec4(c + spec, 1.0);
  }`;

function Ribbon({ index }: { index: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const turns = 1.4 + index * 0.15;
    const phase = (index / COLORS.length) * Math.PI * 2;
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const a = phase + t * Math.PI * 2 * turns;
      const r = 2.1 + Math.sin(t * Math.PI * 3 + index) * 0.5;
      pts.push(new THREE.Vector3(Math.cos(a) * r, (t - 0.5) * 4.2 + Math.sin(a * 2) * 0.3, Math.sin(a) * r * 0.8));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 220, 0.13 - index * 0.008, 16, false);
  }, [index]);
  const uniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color(COLORS[index]) }, uTime: { value: 0 }, uProgress: { value: 1 } }),
    [index],
  );
  useFrame((s) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = s.clock.elapsedTime + index;
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    const intro = Math.min(s.clock.elapsedTime / 2.2, 1);
    mat.current.uniforms.uProgress.value = intro * (1 - p * 0.95);
  });
  return (
    <mesh geometry={geo}>
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

function Phone() {
  const tex = useTexture(heroImg);
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.repeat.set(0.27, 0.78);
    tex.offset.set(0.36, 0.12);
  }, [tex]);
  return (
    <group>
      <RoundedBox args={[1.9, 3.9, 0.18]} radius={0.16} smoothness={6}>
        <meshStandardMaterial color="#1a1a1e" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0, 0.092]}>
        <planeGeometry args={[1.76, 3.74]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rig() {
  const g = useRef<THREE.Group>(null);
  useFrame((s, d) => {
    if (!g.current) return;
    const dt = Math.min(d, 0.05);
    const p = Math.min(window.scrollY / window.innerHeight, 1);
    const k = 1 - Math.exp(-4 * dt);
    g.current.rotation.y += (s.clock.elapsedTime * 0.25 + s.pointer.x * 0.5 - g.current.rotation.y) * k;
    g.current.rotation.x += (-s.pointer.y * 0.25 + p * 0.6 - g.current.rotation.x) * k;
    const sc = 1 - p * 0.35;
    g.current.scale.setScalar(sc);
    g.current.position.y = -p * 1.2;
  });
  return (
    <group ref={g} rotation={[0, 0, -0.12]}>
      <Phone />
      {COLORS.map((_, i) => <Ribbon key={i} index={i} />)}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <Environment>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} />
        <Lightformer intensity={1} color="#ffd9b0" position={[-5, 1, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <Rig />
    </Canvas>
  );
}
