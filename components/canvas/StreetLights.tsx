'use client';

import React, { useMemo } from 'react';
import { Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export default function StreetLights({ curve }: { curve: THREE.Curve<THREE.Vector3> }) {
    // Generate positions along the path
    const lights = useMemo(() => {
        const items = [];
        const count = 10; // Number of light pairs

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const point = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t);

            // Calculate normal (perpendicular to tangent) for offset
            const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

            // Offset left and right
            const offsetDist = 8; // Distance from center of road

            const leftPos = point.clone().add(normal.clone().multiplyScalar(offsetDist));
            const rightPos = point.clone().add(normal.clone().multiplyScalar(-offsetDist));

            items.push({ pos: leftPos, side: 'left' });
            items.push({ pos: rightPos, side: 'right' });
        }
        return items;
    }, [curve]);

    return (
        <group>
            {lights.map((item, i) => (
                <group key={i} position={item.pos}>
                    {/* Pole */}
                    <Cylinder args={[0.1, 0.1, 4]} position={[0, 2, 0]} material={new THREE.MeshStandardMaterial({ color: '#333' })} />
                    {/* Arm */}
                    <Cylinder
                        args={[0.05, 0.05, 1.5]}
                        position={[item.side === 'left' ? 0.75 : -0.75, 4, 0]}
                        rotation={[0, 0, Math.PI / 2]}
                        material={new THREE.MeshStandardMaterial({ color: '#333' })}
                    />
                    {/* Bulb */}
                    <mesh position={[item.side === 'left' ? 1.5 : -1.5, 3.8, 0]}>
                        <sphereGeometry args={[0.3]} />
                        <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={2} />
                        <pointLight intensity={1} distance={10} color="#ffaa00" />
                    </mesh>
                </group>
            ))}
        </group>
    );
}
