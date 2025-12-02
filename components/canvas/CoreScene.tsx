'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Environment, ContactShadows, Scroll } from '@react-three/drei';
import TheArtifact from './TheArtifact';
import Overlay from '../ui/Overlay';

export default function CoreScene() {
    return (
        <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true }}
        >
            <color attach="background" args={['#e0e0e0']} />

            <Suspense fallback={null}>
                <Environment preset="studio" />

                <ScrollControls pages={5} damping={0.1}>
                    <TheArtifact />

                    <Scroll html style={{ width: '100%' }}>
                        <Overlay />
                    </Scroll>

                    {/* Soft Shadow to ground the object */}
                    <ContactShadows
                        position={[0, -2, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.5}
                        far={4}
                    />
                </ScrollControls>
            </Suspense>
        </Canvas>
    );
}
