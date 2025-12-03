'use client';

import React from 'react';
import { PerspectiveCamera, Environment, OrbitControls, Html } from '@react-three/drei';

// --- Components ---

function NeatCard({ position, label, value, status, color = '#007AFF' }: { position: [number, number, number], label: string, value: string, status: string, color?: string }) {
    return (
        <group position={position}>
            <Html position={[0, 0, 0]} transform style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '20px',
                    width: '180px',
                    height: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
                    fontFamily: '"Inter", sans-serif',
                    color: '#1d1d1f'
                }}>
                    {/* Label */}
                    <div style={{
                        fontSize: '0.6rem',
                        color: '#86868b',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        {label}
                    </div>

                    {/* Value */}
                    <div style={{
                        fontSize: '2.2rem',
                        fontWeight: 700,
                        lineHeight: '1',
                        letterSpacing: '-0.03em',
                        color: '#000000'
                    }}>
                        {value}
                    </div>

                    {/* Status Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: color
                        }}></div>
                        <div style={{
                            fontSize: '0.7rem',
                            color: '#424245',
                            fontWeight: 500
                        }}>
                            {status}
                        </div>
                    </div>
                </div>
            </Html>
        </group>
    );
}

// --- Main Scene ---

export default function DashboardScene() {
    return (
        <>
            <color attach="background" args={['#f5f5f7']} />
            <fog attach="fog" args={['#f5f5f7', 8, 25]} />

            <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={35} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.2} />

            {/* Lighting */}
            <Environment preset="city" environmentIntensity={0.5} blur={1} />
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
            <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#eefeff" />

            {/* Three Neat Cards - Smaller & Spaced Out */}
            <group position={[0, 0, 0]}>
                <NeatCard
                    position={[-3.5, 0, 0]}
                    label="Efficiency"
                    value="98%"
                    status="Target Met"
                    color="#34C759"
                />
                <NeatCard
                    position={[0, 0, 0]}
                    label="Active Units"
                    value="2,415"
                    status="Online"
                    color="#007AFF"
                />
                <NeatCard
                    position={[3.5, 0, 0]}
                    label="System Status"
                    value="100%"
                    status="Optimal"
                    color="#5856D6"
                />
            </group>

        </>
    );
}
