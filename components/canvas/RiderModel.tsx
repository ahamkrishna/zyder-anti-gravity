'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Torus } from '@react-three/drei';
import * as THREE from 'three';

export default function RiderModel(props: React.JSX.IntrinsicElements['group']) {
    const frontWheel = useRef<THREE.Mesh>(null);
    const backWheel = useRef<THREE.Mesh>(null);

    const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.2,
        metalness: 0.8,
    }), []);

    const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#FF3300',
        emissive: '#FF3300',
        emissiveIntensity: 2,
        toneMapped: false,
    }), []);

    useFrame((state, delta) => {
        // Rotate wheels based on "speed" (simulated)
        if (frontWheel.current) frontWheel.current.rotation.x -= delta * 10;
        if (backWheel.current) backWheel.current.rotation.x -= delta * 10;
    });

    return (
        <group {...props}>
            {/* Main Body */}
            <group position={[0, 0.5, 0]}>
                {/* Chassis */}
                <RoundedBox args={[0.5, 0.5, 1.5]} radius={0.1} smoothness={4} material={bodyMaterial} castShadow receiveShadow />

                {/* Rider Block (Abstract) */}
                <RoundedBox position={[0, 0.6, -0.2]} args={[0.4, 0.8, 0.4]} radius={0.1} smoothness={4} material={bodyMaterial} castShadow />
                {/* Helmet/Head */}
                <RoundedBox position={[0, 1.2, -0.1]} args={[0.3, 0.35, 0.35]} radius={0.15} smoothness={4} material={bodyMaterial} castShadow />
                {/* Visor Glow */}
                <mesh position={[0, 1.2, 0.1]} material={glowMaterial}>
                    <boxGeometry args={[0.25, 0.1, 0.05]} />
                </mesh>
            </group>

            {/* Wheels */}
            <group position={[0, 0.3, 0.5]}>
                <mesh ref={frontWheel} rotation={[0, Math.PI / 2, 0]} material={glowMaterial}>
                    <torusGeometry args={[0.3, 0.05, 16, 32]} />
                </mesh>
            </group>
            <group position={[0, 0.3, -0.5]}>
                <mesh ref={backWheel} rotation={[0, Math.PI / 2, 0]} material={glowMaterial}>
                    <torusGeometry args={[0.3, 0.05, 16, 32]} />
                </mesh>
            </group>
        </group>
    );
}
