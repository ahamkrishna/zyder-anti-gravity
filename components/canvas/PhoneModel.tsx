import React, { useMemo, useRef } from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function PhoneModel(props: React.JSX.IntrinsicElements['group']) {
    const textRef = useRef<THREE.Mesh>(null);

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

    useFrame((state) => {
        if (textRef.current) {
            const time = state.clock.getElapsedTime();
            // Pulse effect
            const pulse = Math.sin(time * 3) * 0.1 + 1;
            textRef.current.scale.set(pulse, pulse, 1);

            // Color shift effect (Subtle Blue to White)
            const material = textRef.current.material as THREE.MeshBasicMaterial;
            // We can't easily animate color on the standard Text material prop without a ref to the material or using a custom material.
            // But Text component handles color prop.
            // Let's just stick to scale pulse for now, maybe opacity glitch?
            material.opacity = 0.8 + Math.sin(time * 10) * 0.1;
        }
    });

    return (
        <group {...props}>
            {/* Phone Body - Using RoundedBox for sleek look */}
            <RoundedBox args={[1.5, 3, 0.2]} radius={0.1} smoothness={4} material={bodyMaterial} castShadow receiveShadow />

            {/* Screen */}
            <mesh position={[0, 0, 0.11]} material={screenMaterial}>
                <planeGeometry args={[1.4, 2.9]} />
            </mesh>

            {/* ZYDER Text Effect */}
            <group position={[0, 0, 0.12]}>
                <Text
                    ref={textRef}
                    font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                    fontSize={0.3}
                    letterSpacing={0.1}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                >
                    ZYDER
                    <meshBasicMaterial attach="material" color="#ffffff" toneMapped={false} transparent opacity={0.9} />
                </Text>
            </group>

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
