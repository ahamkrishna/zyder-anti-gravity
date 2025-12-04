'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Icosahedron, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function NeuralCore() {
    const coreRef = useRef<THREE.Group>(null);
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    // Generate random particles
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 100; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() * 0.05;
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            temp.push({ t, factor, speed, x, y, z });
        }
        return temp;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (outerRef.current) {
            outerRef.current.rotation.x = t * 0.1;
            outerRef.current.rotation.y = t * 0.15;
        }
        if (innerRef.current) {
            innerRef.current.rotation.x = -t * 0.2;
            innerRef.current.rotation.y = -t * 0.25;
            // Breathing effect
            const scale = 1 + Math.sin(t * 2) * 0.05;
            innerRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group ref={coreRef}>
            {/* Inner Core (Glowing) */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Icosahedron ref={innerRef} args={[1.5, 0]}>
                    <meshPhysicalMaterial
                        color="#00f0ff"
                        emissive="#00f0ff"
                        emissiveIntensity={2}
                        roughness={0}
                        metalness={1}
                        wireframe
                    />
                </Icosahedron>
            </Float>

            {/* Outer Shell (Glass) */}
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
                <Icosahedron ref={outerRef} args={[2.5, 1]}>
                    <meshPhysicalMaterial
                        color="#ffffff"
                        transmission={0.9}
                        opacity={0.5}
                        roughness={0}
                        metalness={0.1}
                        thickness={2}
                        clearcoat={1}
                        transparent
                    />
                </Icosahedron>
            </Float>

            {/* Connecting Lines / Data Streams */}
            {particles.map((p, i) => (
                <mesh key={i} position={[p.x, p.y, p.z]}>
                    <sphereGeometry args={[0.03, 8, 8]} />
                    <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} />
                </mesh>
            ))}

            {/* Background Stars/Dust */}
            <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}
