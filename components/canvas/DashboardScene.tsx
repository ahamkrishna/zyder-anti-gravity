'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, OrbitControls, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

function CrystalGlobe() {
    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    // Generate points using Fibonacci Sphere algorithm for perfect distribution
    const particles = useMemo(() => {
        const count = 2000;
        const positions = new Float32Array(count * 3);
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

        for (let i = 0; i < count; i++) {
            const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
            const radius = Math.sqrt(1 - y * y); // Radius at y
            const theta = phi * i; // Golden angle increment

            const r = 2.5; // Sphere radius

            positions[i * 3] = r * Math.cos(theta) * radius;
            positions[i * 3 + 1] = y * r;
            positions[i * 3 + 2] = r * Math.sin(theta) * radius;
        }
        return positions;
    }, []);

    return (
        <group>
            {/* Data Cloud (Particle Earth) */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[particles, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    color="#000000" // Black dots on white background for contrast
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>

            {/* Subtle Inner Glow to define volume */}
            <mesh scale={[0.9, 0.9, 0.9]}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshBasicMaterial color="#eefeff" transparent opacity={0.05} side={THREE.BackSide} />
            </mesh>
        </group>
    );
}



export default function DashboardScene() {
    return (
        <>
            {/* Clean, Premium Background */}
            <color attach="background" args={['#f0f0f0']} />
            <fog attach="fog" args={['#f0f0f0', 5, 25]} />

            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />

            {/* Studio Lighting */}
            <ambientLight intensity={1.5} />
            <directionalLight position={[5, 10, 7]} intensity={2} color="#ffffff" castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={1} color="#eefeff" />
            <rectAreaLight width={10} height={10} position={[0, 10, 0]} intensity={2} color="#ffffff" />

            <group position={[0, 0, 0]}>
                <CrystalGlobe />
            </group>

            {/* HDRI for Reflections */}
            <Environment preset="studio" environmentIntensity={1} blur={0.5} />

            {/* Subtle Post-Processing */}
            <EffectComposer>
                <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.5} radius={0.2} />
                <Vignette eskil={false} offset={0.1} darkness={0.4} />
            </EffectComposer>
        </>
    );
}
