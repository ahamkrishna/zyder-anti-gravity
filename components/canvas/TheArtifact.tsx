'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

// Custom Shader Material for "Liquid Metal"
const LiquidMetalMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uColor: { value: new THREE.Color('#000000') },
    uMouse: { value: new THREE.Vector2(0, 0) },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;

    // Simplex Noise (Standard)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      
      // --- Morphing Logic ---
      
      // Base Noise
      float noise = snoise(position * 1.5 + uTime * 0.3);
      
      // Phase 1: Calm (Scroll 0-0.3)
      float calmDistortion = noise * 0.1;
      
      // Phase 2: Neural Spikes (Scroll 0.3-0.6)
      float spikeNoise = snoise(position * 4.0 + uTime * 1.0);
      float spikeDistortion = spikeNoise * 0.5 * smoothstep(0.2, 0.5, uScroll);
      
      // Phase 3: Liquid Stretch (Scroll 0.6-1.0)
      float stretch = max(0.0, uScroll - 0.6) * 2.0;
      vec3 stretchVec = vec3(0.0, stretch * position.y, 0.0);
      
      // Combine Phases
      float totalDistortion = calmDistortion + spikeDistortion;
      vec3 newPosition = position + normal * totalDistortion + stretchVec;
      
      // Mouse Interaction (Magnetic)
      float distToMouse = distance(uMouse, vUv * 2.0 - 1.0); // Simple UV based mouse check
      // Note: Real 3D mouse interaction requires raycasting, but for vertex shader we can use UVs or world pos if passed
      // Here we keep it simple: subtle global sway based on mouse
      newPosition.x += uMouse.x * 0.5;
      newPosition.y += uMouse.y * 0.5;

      vPosition = newPosition;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uColor;
    
    void main() {
      // Lighting
      vec3 lightPos = vec3(10.0, 10.0, 10.0);
      vec3 lightDir = normalize(lightPos - vPosition);
      float diff = max(dot(vNormal, lightDir), 0.0);
      
      // Iridescence / Holographic effect
      vec3 viewDir = normalize(-vPosition);
      float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
      rim = pow(rim, 2.0);
      
      vec3 baseColor = uColor;
      vec3 rimColor = vec3(0.0, 0.5, 1.0); // Cyan Rim
      
      vec3 finalColor = baseColor * (diff * 0.8 + 0.2) + rimColor * rim;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

export default function TheArtifact() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const mouse = useRef(new THREE.Vector2(0, 0));

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uColor: { value: new THREE.Color('#1a1a1a') },
      uMouse: { value: new THREE.Vector2(0, 0) },
    },
    vertexShader: LiquidMetalMaterial.vertexShader,
    fragmentShader: LiquidMetalMaterial.fragmentShader,
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;

      // Update Uniforms
      material.uniforms.uTime.value = state.clock.getElapsedTime();
      material.uniforms.uScroll.value = scroll.offset;

      // Smooth Mouse
      mouse.current.lerp(state.pointer, 0.1);
      material.uniforms.uMouse.value = mouse.current;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <icosahedronGeometry args={[1.5, 128]} />
    </mesh>
  );
}
