'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Shader for the dust particles
const DustShader = {
    uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 }, // 0 = scattered, 1 = formed
        uColor: { value: new THREE.Color('#ffffff') },
    },
    vertexShader: `
    uniform float uTime;
    uniform float uProgress;
    attribute vec3 aRandomPos;
    
    varying float vAlpha;

    void main() {
      vec3 pos = position;
      
      // Interpolate between random position and target position (logo shape)
      // Ease out cubic
      float t = 1.0 - pow(1.0 - uProgress, 3.0);
      
      vec3 currentPos = mix(aRandomPos, pos, t);
      
      // Add some noise/wobble when forming
      currentPos.x += sin(uTime * 2.0 + pos.y) * 0.02 * (1.0 - t);
      currentPos.y += cos(uTime * 2.0 + pos.x) * 0.02 * (1.0 - t);
      
      vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Size attenuation
      gl_PointSize = (2.0 + t * 2.0) * (10.0 / -mvPosition.z);
      
      vAlpha = smoothstep(0.0, 0.2, uProgress); // Fade in
    }
  `,
    fragmentShader: `
    uniform vec3 uColor;
    varying float vAlpha;
    
    void main() {
      // Circular particle
      vec2 uv = gl_PointCoord.xy - 0.5;
      float r = length(uv);
      if (r > 0.5) discard;
      
      // Soft edge
      float glow = 1.0 - (r * 2.0);
      glow = pow(glow, 1.5);
      
      gl_FragColor = vec4(uColor, vAlpha * glow);
    }
  `
};

export default function DustLogo() {
    const pointsRef = useRef<THREE.Points>(null);

    // Generate particles forming "ZYDER"
    const { positions, randomPositions } = useMemo(() => {
        const count = 2000;
        const pos = new Float32Array(count * 3);
        const rand = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Target: A stylized "Z" or just a dense cluster
            let x, y, z;
            const section = Math.random();

            if (section < 0.33) {
                // Top bar
                x = (Math.random() - 0.5) * 2;
                y = 0.8 + (Math.random() - 0.5) * 0.2;
                z = 0;
            } else if (section < 0.66) {
                // Diagonal: Top-Right (1, 0.8) to Bottom-Left (-1, -0.8)
                const t = Math.random(); // 0 to 1
                x = (0.5 - t) * 2; // 1 to -1
                y = (0.5 - t) * 1.6; // 0.8 to -0.8
                z = 0;
            } else {
                // Bottom bar
                x = (Math.random() - 0.5) * 2;
                y = -0.8 + (Math.random() - 0.5) * 0.2;
                z = 0;
            }

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            // Random start pos
            rand[i * 3] = (Math.random() - 0.5) * 10;
            rand[i * 3 + 1] = (Math.random() - 0.5) * 10;
            rand[i * 3 + 2] = (Math.random() - 0.5) * 5 + 5; // Start closer to camera
        }

        return { positions: pos, randomPositions: rand };
    }, []);

    const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: DustShader.uniforms,
        vertexShader: DustShader.vertexShader,
        fragmentShader: DustShader.fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    }), []);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('aRandomPos', new THREE.BufferAttribute(randomPositions, 3));
        return geo;
    }, [positions, randomPositions]);

    useFrame((state) => {
        if (pointsRef.current) {
            const time = state.clock.getElapsedTime();
            shaderMaterial.uniforms.uTime.value = time;
            shaderMaterial.uniforms.uProgress.value = THREE.MathUtils.clamp(time * 0.5, 0, 1);
        }
    });

    return (
        <points ref={pointsRef} material={shaderMaterial} geometry={geometry} />
    );
}
