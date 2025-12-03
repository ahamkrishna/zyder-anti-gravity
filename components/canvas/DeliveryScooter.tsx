'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Cylinder, Torus, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function DeliveryScooter(props: React.JSX.IntrinsicElements['group']) {
    const frontWheel = useRef<THREE.Mesh>(null);
    const backWheel = useRef<THREE.Mesh>(null);

    // Materials
    const bodyMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#1a1a1a', // Dark Grey/Black Body
        roughness: 0.3,
        metalness: 0.8,
    }), []);

    const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#FF3300', // Zyder Orange
        roughness: 0.2,
        metalness: 0.5,
    }), []);

    const chromeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.1,
        metalness: 1.0,
    }), []);

    const tireMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#050505',
        roughness: 0.8,
        metalness: 0.1,
    }), []);

    const glowMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#44aaff',
        emissive: '#44aaff',
        emissiveIntensity: 2,
        toneMapped: false,
    }), []);

    const scroll = useScroll();

    useFrame(() => {
        // Rotate wheels based on scroll offset (Syncs with movement)
        // Multiplier determines spin speed. Positive = Forward spin for -Z facing bike.
        const rotation = scroll.offset * 1000;

        if (frontWheel.current) frontWheel.current.rotation.x = rotation;
        if (backWheel.current) backWheel.current.rotation.x = rotation;
    });

    return (
        <group {...props}>
            {/* Main Group - No Rotation (Standard -Z facing) */}
            <group>

                {/* Main Chassis */}
                <group position={[0, 0.4, 0]}>
                    {/* Floorboard */}
                    <RoundedBox args={[0.6, 0.1, 1.2]} radius={0.05} smoothness={4} material={bodyMaterial} position={[0, 0, 0]} />

                    {/* Front Shield */}
                    <RoundedBox args={[0.5, 0.8, 0.1]} radius={0.05} smoothness={4} material={accentMaterial} position={[0, 0.5, 0.5]} rotation={[-0.2, 0, 0]} />

                    {/* Seat Base */}
                    <RoundedBox args={[0.5, 0.4, 0.6]} radius={0.05} smoothness={4} material={bodyMaterial} position={[0, 0.25, -0.3]} />

                    {/* Seat */}
                    <RoundedBox args={[0.5, 0.1, 0.7]} radius={0.05} smoothness={4} material={new THREE.MeshStandardMaterial({ color: '#333' })} position={[0, 0.5, -0.3]} />
                </group>

                {/* Cargo Box (The "Context" fit) */}
                <group position={[0, 0.8, -0.6]}>
                    <RoundedBox args={[0.7, 0.6, 0.7]} radius={0.05} smoothness={4} material={accentMaterial} castShadow />
                    {/* Zyder Logo Placeholder on Box */}
                    <mesh position={[0, 0, -0.36]} rotation={[0, Math.PI, 0]}>
                        <planeGeometry args={[0.4, 0.2]} />
                        <meshBasicMaterial color="#ffffff" />
                    </mesh>
                </group>

                {/* Handlebars */}
                <group position={[0, 1.0, 0.4]} rotation={[-0.2, 0, 0]}>
                    <Cylinder args={[0.03, 0.03, 0.8]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial} />
                    {/* Grips */}
                    <Cylinder args={[0.04, 0.04, 0.15]} rotation={[0, 0, Math.PI / 2]} position={[0.35, 0, 0]} material={tireMaterial} />
                    <Cylinder args={[0.04, 0.04, 0.15]} rotation={[0, 0, Math.PI / 2]} position={[-0.35, 0, 0]} material={tireMaterial} />
                    {/* Display */}
                    <RoundedBox args={[0.2, 0.1, 0.05]} position={[0, 0.05, 0]} material={glowMaterial} />
                </group>

                {/* Front Fork */}
                <group position={[0, 0.3, 0.5]} rotation={[-0.2, 0, 0]}>
                    <Cylinder args={[0.04, 0.03, 0.6]} position={[0.15, 0, 0]} material={chromeMaterial} />
                    <Cylinder args={[0.04, 0.03, 0.6]} position={[-0.15, 0, 0]} material={chromeMaterial} />
                </group>

                <group position={[0, 0.25, 0.6]}> {/* Front */}
                    <mesh ref={frontWheel} rotation={[0, Math.PI / 2, 0]}>
                        <torusGeometry args={[0.25, 0.08, 16, 32]} />
                        <primitive object={tireMaterial} attach="material" />
                        {/* Spokes */}
                        <group rotation={[0, 0, 0]}>
                            <Cylinder args={[0.02, 0.02, 0.45]} rotation={[0, 0, 0]} material={chromeMaterial} />
                            <Cylinder args={[0.02, 0.02, 0.45]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial} />
                        </group>
                    </mesh>
                    {/* Rim */}
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
                        <cylinderGeometry args={[0.18, 0.18, 0.1, 32]} />
                        <primitive object={chromeMaterial} attach="material" />
                    </mesh>
                </group>

                <group position={[0, 0.25, -0.6]}> {/* Back */}
                    <mesh ref={backWheel} rotation={[0, Math.PI / 2, 0]}>
                        <torusGeometry args={[0.25, 0.08, 16, 32]} />
                        <primitive object={tireMaterial} attach="material" />
                        {/* Spokes */}
                        <group rotation={[0, 0, 0]}>
                            <Cylinder args={[0.02, 0.02, 0.45]} rotation={[0, 0, 0]} material={chromeMaterial} />
                            <Cylinder args={[0.02, 0.02, 0.45]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial} />
                        </group>
                    </mesh>
                </group>

                {/* Headlight */}
                <mesh position={[0, 0.8, 0.55]} rotation={[-0.2, 0, 0]}>
                    <cylinderGeometry args={[0.1, 0.08, 0.1, 32]} />
                    <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={5} />
                </mesh>

            </group>
        </group>
    );
}
