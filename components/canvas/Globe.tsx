'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, QuadraticBezierLine, Html } from '@react-three/drei';
import * as THREE from 'three';

// Generate random arcs
const ARCS_COUNT = 20;
const GLOBE_RADIUS = 4;

function generateArcs() {
    return new Array(ARCS_COUNT).fill(0).map(() => {
        // Random start and end points on sphere
        const phi1 = Math.random() * Math.PI;
        const theta1 = Math.random() * Math.PI * 2;
        const phi2 = Math.random() * Math.PI;
        const theta2 = Math.random() * Math.PI * 2;

        const start = new THREE.Vector3().setFromSphericalCoords(GLOBE_RADIUS, phi1, theta1);
        const end = new THREE.Vector3().setFromSphericalCoords(GLOBE_RADIUS, phi2, theta2);

        // Control point (midpoint, pushed out)
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(GLOBE_RADIUS * 1.5);

        return { start, end, mid };
    });
}

export default function Globe() {
    const globeRef = useRef<THREE.Group>(null);
    const arcs = useMemo(() => generateArcs(), []);

    useFrame((state) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.002; // Slow rotation
        }
    });

    return (
        <group ref={globeRef}>
            {/* The Earth Sphere */}
            <Sphere args={[GLOBE_RADIUS, 64, 64]}>
                <meshPhysicalMaterial
                    color="#051020" // Deep Ocean Blue
                    emissive="#001020"
                    roughness={0.6}
                    metalness={0.2}
                    clearcoat={0.1}
                />
            </Sphere>

            {/* Wireframe Overlay (Longitude/Latitude) */}
            <Sphere args={[GLOBE_RADIUS + 0.02, 32, 32]}>
                <meshBasicMaterial
                    color="#004060"
                    wireframe
                    transparent
                    opacity={0.1}
                />
            </Sphere>

            {/* Glowing Arcs (Delivery Routes) */}
            {arcs.map((arc, i) => (
                <QuadraticBezierLine
                    key={i}
                    start={arc.start}
                    end={arc.end}
                    mid={arc.mid}
                    color={new THREE.Color('#00f0ff')}
                    lineWidth={1.5}
                    transparent
                    opacity={0.6}
                />
            ))}

            {/* City Dots (Random glowing points) */}
            {arcs.map((arc, i) => (
                <mesh key={`dot-${i}`} position={arc.start}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshBasicMaterial color="#00ffaa" />
                </mesh>
            ))}
        </group>
    );
}
