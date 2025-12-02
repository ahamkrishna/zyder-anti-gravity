'use client';

import React, { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function PhoneModel(props: React.JSX.IntrinsicElements['group']) {
    const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#050505',
        roughness: 0.1,
        metalness: 0.9,
    }), []);

    const screenMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#000000',
        roughness: 0.2,
        metalness: 0.8,
        emissive: '#111111',
        emissiveIntensity: 0.5,
    }), []);

    const frameMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#333333',
        roughness: 0.2,
        metalness: 1.0,
    }), []);

    return (
        <group {...props}>
            {/* Phone Body - Using RoundedBox for sleek look */}
            <RoundedBox args={[1.5, 3, 0.2]} radius={0.1} smoothness={4} material={bodyMaterial} castShadow receiveShadow />

            {/* Screen */}
            <mesh position={[0, 0, 0.11]} material={screenMaterial}>
                <planeGeometry args={[1.4, 2.9]} />
            </mesh>

            {/* Side Buttons */}
            <mesh position={[0.76, 0.5, 0]} material={frameMaterial}>
                <boxGeometry args={[0.02, 0.4, 0.05]} />
            </mesh>

            {/* Camera Bump */}
            <mesh position={[0.5, 1.2, -0.12]} material={frameMaterial}>
                <boxGeometry args={[0.4, 0.4, 0.05]} />
            </mesh>
        </group>
    );
}
