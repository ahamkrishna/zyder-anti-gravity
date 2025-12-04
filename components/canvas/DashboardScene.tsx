'use client';

import React from 'react';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import NeuralCore from './NeuralCore';
import GlassCard from './GlassCard';

export default function DashboardScene() {
    return (
        <>
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 10, 40]} />

            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={false}
                maxPolarAngle={Math.PI / 1.5}
                minPolarAngle={Math.PI / 3}
            />

            {/* Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
            <pointLight position={[-10, -10, 10]} intensity={0.5} color="#ffffff" />

            {/* The Neural Core */}
            <NeuralCore />

            {/* Floating Data Cards - Distributed in 3D Space */}
            <group position={[0, 0, 0]}>

                {/* Top Left - Highlighted Metric */}
                <GlassCard
                    position={[-5.5, 2.5, 0]}
                    label="Active Drones"
                    value="8,412"
                    subtext="+124 new connections"
                    align="right"
                    highlight={true}
                />

                {/* Bottom Left - Standard Metric */}
                <GlassCard
                    position={[-4, -2, 0]}
                    label="Neural Load"
                    value="42%"
                    subtext="Processing optimal routes"
                    align="right"
                />

                {/* Top Right - Highlighted Metric */}
                <GlassCard
                    position={[5.5, 2.5, 0]}
                    label="Total Revenue"
                    value="$4.2M"
                    subtext="12.5% vs last month"
                    align="left"
                    highlight={true}
                />

                {/* Bottom Right - Standard Metric */}
                <GlassCard
                    position={[4, -2, 0]}
                    label="System Status"
                    value="ONLINE"
                    subtext="99.99% Uptime"
                    align="left"
                />
            </group>

            <Environment preset="city" />
        </>
    );
}
