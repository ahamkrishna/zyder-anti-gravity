'use client';

import { useRef, useMemo, useLayoutEffect } from 'react';
import { InstancedMesh, Object3D, Color } from 'three';
import { useFrame } from '@react-three/fiber';

const CITY_SIZE = 20;
const BUILDING_COUNT = 400;

export default function HoloCity() {
    const meshRef = useRef<InstancedMesh>(null);
    const dummy = useMemo(() => new Object3D(), []);

    // Generate random building data
    const buildings = useMemo(() => {
        const data = [];
        for (let i = 0; i < BUILDING_COUNT; i++) {
            const x = (Math.random() - 0.5) * CITY_SIZE;
            const z = (Math.random() - 0.5) * CITY_SIZE;
            // Height based on distance from center (higher in center)
            const dist = Math.sqrt(x * x + z * z);
            const height = Math.max(0.5, (1 - dist / (CITY_SIZE * 0.6)) * 8 + Math.random() * 2);

            if (height > 0.5) { // Only keep buildings that are tall enough
                data.push({ x, z, height, scale: 0.8 + Math.random() * 0.4 });
            }
        }
        return data;
    }, []);

    useLayoutEffect(() => {
        if (!meshRef.current) return;

        buildings.forEach((data, i) => {
            dummy.position.set(data.x, data.height / 2, data.z);
            dummy.scale.set(data.scale, data.height, data.scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [buildings, dummy]);

    // Subtle pulse animation
    useFrame((state) => {
        if (!meshRef.current) return;
        // Optional: Add some dynamic effect here if needed, e.g. color shift
    });

    return (
        <group>
            {/* The City Mesh */}
            <instancedMesh ref={meshRef} args={[undefined, undefined, buildings.length]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshPhysicalMaterial
                    color="#001020"
                    emissive="#00f0ff"
                    emissiveIntensity={0.2}
                    transparent
                    opacity={0.8}
                    transmission={0.2}
                    roughness={0.1}
                    metalness={0.8}
                    thickness={1}
                />
            </instancedMesh>

            {/* Grid Floor */}
            <gridHelper args={[CITY_SIZE * 1.5, 40, '#004050', '#001020']} position={[0, 0.01, 0]} />

            {/* Scanning Light Effect (Fake) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
                <planeGeometry args={[CITY_SIZE * 1.5, CITY_SIZE * 1.5]} />
                <meshBasicMaterial color="#00f0ff" transparent opacity={0.05} depthWrite={false} />
            </mesh>
        </group>
    );
}
