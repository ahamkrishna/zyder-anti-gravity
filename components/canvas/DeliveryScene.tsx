'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, PerspectiveCamera, Environment, Float, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import RiderModel from './RiderModel';
import DeliveryOverlay from '@/components/ui/DeliveryOverlay';

function DeliveryPath({ onComplete }: { onComplete?: () => void }) {
    const scroll = useScroll();
    const riderRef = useRef<THREE.Group>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const completed = useRef(false);

    // Create a curved path
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -10),
            new THREE.Vector3(5, 0, -20),
            new THREE.Vector3(5, 0, -40),
            new THREE.Vector3(0, 0, -60),
            new THREE.Vector3(-5, 0, -80),
            new THREE.Vector3(0, 0, -100),
        ]);
    }, []);

    const linePoints = useMemo(() => curve.getPoints(100), [curve]);

    useFrame((state, delta) => {
        // Scroll offset (0 to 1)
        const offset = scroll.offset;

        // Check for completion
        if (offset > 0.99 && !completed.current && onComplete) {
            completed.current = true;
            onComplete();
        }

        // Get point on curve based on scroll
        const point = curve.getPointAt(offset);
        const tangent = curve.getTangentAt(offset);

        if (riderRef.current) {
            // Move rider
            riderRef.current.position.copy(point);

            // Orient rider to face forward
            const lookAt = point.clone().add(tangent);
            riderRef.current.lookAt(lookAt);

            // Camera Follow
            // Camera positioned slightly behind and above the rider
            const cameraOffset = new THREE.Vector3(0, 3, 6);
            // Apply rider's rotation to camera offset
            cameraOffset.applyQuaternion(riderRef.current.quaternion);
            const cameraPos = point.clone().add(cameraOffset);

            // Smoothly interpolate camera position
            state.camera.position.lerp(cameraPos, 0.1);
            state.camera.lookAt(point);
        }
    });

    return (
        <group>
            {/* The Path Visualization (Glowing Tube) */}
            <mesh>
                <tubeGeometry args={[curve, 100, 0.2, 8, false]} />
                <meshStandardMaterial color="#FF3300" emissive="#FF3300" emissiveIntensity={0.5} transparent opacity={0.8} />
            </mesh>

            {/* The Rider */}
            <group ref={riderRef}>
                <RiderModel />
            </group>

            {/* Floor Grid for speed reference */}
            <gridHelper args={[200, 50, 0x333333, 0x111111]} position={[0, -0.1, -50]} />
        </group>
    );
}

export default function DeliveryScene({ onComplete }: { onComplete?: () => void }) {
    return (
        <>
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 5, 30]} />

            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

            <ScrollControls pages={5} damping={0.2}>
                <DeliveryPath onComplete={onComplete} />
                <Scroll html style={{ width: '100%' }}>
                    <DeliveryOverlay />
                </Scroll>
            </ScrollControls>

            <Environment preset="city" />
        </>
    );
}
