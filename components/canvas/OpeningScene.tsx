import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera } from '@react-three/drei';
import DustLogo from './DustLogo';
import PhoneModel from './PhoneModel';
import * as THREE from 'three';

function IntroSequence() {
    const phoneRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (phoneRef.current) {
            // Phone rises from darkness after 2 seconds
            const riseProgress = THREE.MathUtils.clamp((time - 2) * 0.5, 0, 1);
            // Ease out back
            const y = -5 + riseProgress * 5;
            phoneRef.current.position.y = y;

            // Gentle rotation
            phoneRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
        }
    });

    return (
        <group>
            <DustLogo />

            <group ref={phoneRef} position={[0, -5, 0]}>
                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <PhoneModel />
                </Float>
            </group>
        </group>
    );
}

export default function OpeningScene({ onComplete }: { onComplete: () => void }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
            <color attach="background" args={['#000000']} />

            <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF3300" />

                <IntroSequence />

                <Environment preset="city" environmentIntensity={0.5} />

                {/* Click handler plane */}
                <mesh onClick={onComplete} position={[0, 0, 0]} visible={false}>
                    <planeGeometry args={[100, 100]} />
                    <meshBasicMaterial />
                </mesh>
            </Suspense>
        </>
    );
}
