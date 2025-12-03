'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, PerspectiveCamera, Environment, Float, Scroll } from '@react-three/drei';
import * as THREE from 'three';
import DeliveryScooter from './DeliveryScooter';
import StreetLights from './StreetLights';
import DeliveryOverlay from '@/components/ui/DeliveryOverlay';

function DeliveryPath({ onComplete, onBackward }: { onComplete?: () => void, onBackward?: () => void }) {
    const scroll = useScroll();
    const riderRef = useRef<THREE.Group>(null);
    const completed = useRef(false);
    const atStart = useRef(true);

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

    // Logic Loop: Check offsets and completion
    useFrame((state, delta) => {
        const offset = scroll.offset;
        atStart.current = offset < 0.01;

        if (offset > 0.99 && !completed.current && onComplete) {
            completed.current = true;
            onComplete();
        } else if (offset < 0.99) {
            completed.current = false;
        }
    });

    // Event Listener: Backward Navigation
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (atStart.current && e.deltaY < 0 && onBackward) {
                onBackward();
            }
        };
        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [onBackward]);

    // Animation Loop: Move Rider
    useFrame((state) => {
        const offset = scroll.offset;
        const point = curve.getPointAt(offset);
        const tangent = curve.getTangentAt(offset);

        if (riderRef.current) {
            riderRef.current.position.copy(point);
            const lookAt = point.clone().add(tangent);
            riderRef.current.lookAt(lookAt);

            // Racing Game Camera: Lower and closer
            const cameraOffset = new THREE.Vector3(0, 2, 5);
            cameraOffset.applyQuaternion(riderRef.current.quaternion);
            const cameraPos = point.clone().add(cameraOffset);

            state.camera.position.lerp(cameraPos, 0.1);

            // Look Ahead (Horizon)
            const lookAtTarget = point.clone().add(tangent.multiplyScalar(10)); // Look 10 units ahead
            state.camera.lookAt(lookAtTarget);
        }
    });

    return (
        <group>
            {/* Road Surface */}
            <mesh receiveShadow rotation={[0, 0, 0]} position={[0, -0.21, 0]} scale={[1, 0.05, 1]}>
                <tubeGeometry args={[curve, 100, 4, 8, false]} /> {/* Wider road */}
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Lane Markings (Dashed Line) */}
            {/* We can simulate this with a thinner tube slightly above, or texture. 
                For procedural simple "racing" look, a glowing center strip works well. */}
            <mesh position={[0, -0.19, 0]} scale={[1, 0.05, 1]}>
                <tubeGeometry args={[curve, 50, 0.1, 8, false]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>

            <group ref={riderRef}>
                <DeliveryScooter />
            </group>
            <StreetLights curve={curve} />
        </group>
    );
}

export default function DeliveryScene({ onComplete, onBackward }: { onComplete?: () => void, onBackward?: () => void }) {
    return (
        <>
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 5, 30]} />

            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

            <ScrollControls pages={5} damping={0.2}>
                <DeliveryPath onComplete={onComplete} onBackward={onBackward} />
                <Scroll html style={{ width: '100%' }}>
                    <DeliveryOverlay />
                </Scroll>
            </ScrollControls>

            <Environment preset="city" />
        </>
    );
}
