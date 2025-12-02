'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

// Dynamic imports
const OpeningScene = dynamic(() => import('../components/canvas/OpeningScene'), { ssr: false });
const DeliveryScene = dynamic(() => import('../components/canvas/DeliveryScene'), { ssr: false });
const NetworkScene = dynamic(() => import('../components/canvas/NetworkScene'), { ssr: false });
const DashboardScene = dynamic(() => import('../components/canvas/DashboardScene'), { ssr: false });

export default function Home() {
    const [scene, setScene] = useState<'opening' | 'delivery' | 'hiring' | 'dashboard'>('opening');

    return (
        <main>
            <div className="canvas-container">
                <Canvas
                    dpr={[1, 2]}
                    gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                    shadows
                    camera={{ position: [0, 0, 10], fov: 45 }}
                    style={{ pointerEvents: 'auto' }}
                >
                    {scene === 'opening' && (
                        <OpeningScene onComplete={() => setScene('delivery')} />
                    )}

                    {scene === 'delivery' && (
                        <DeliveryScene onComplete={() => setScene('hiring')} />
                    )}

                    {scene === 'hiring' && (
                        <NetworkScene onComplete={() => setScene('dashboard')} />
                    )}

                    {scene === 'dashboard' && (
                        <DashboardScene />
                    )}
                </Canvas>

                {/* HTML Overlays */}
                {scene === 'opening' && (
                    <>
                        <div style={{
                            position: 'absolute',
                            bottom: '10%',
                            width: '100%',
                            textAlign: 'center',
                            color: '#fff',
                            pointerEvents: 'none',
                            opacity: 0.8,
                            animation: 'pulse 2s infinite',
                            zIndex: 10
                        }}>
                            <p style={{ fontSize: '1.2rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Press to Enter</p>
                        </div>
                        <style jsx>{`
                            @keyframes pulse {
                                0% { opacity: 0.4; }
                                50% { opacity: 1; }
                                100% { opacity: 0.4; }
                            }
                        `}</style>
                    </>
                )}

                {scene === 'delivery' && (
                    <button
                        onClick={() => setScene('hiring')}
                        style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            zIndex: 100,
                            pointerEvents: 'auto'
                        }}
                    >
                        Next: Hiring &rarr;
                    </button>
                )}

                {scene === 'dashboard' && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 100,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0 10%',
                        fontFamily: 'Inter, sans-serif',
                        color: '#1a1a1a' // Dark text for light background
                    }}>
                        {/* Left Panel: Revenue */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500, letterSpacing: '0.2em', marginBottom: '8px', textTransform: 'uppercase' }}>Total Revenue</div>
                            <div style={{ fontSize: '4rem', color: '#000', fontWeight: 700, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>$8.4M</div>
                            <div style={{ fontSize: '1.2rem', color: '#00cc66', fontWeight: 600 }}>+14.2%</div>
                        </div>

                        {/* Right Panel: Operations */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.9rem', color: '#666', fontWeight: 500, letterSpacing: '0.2em', marginBottom: '8px', textTransform: 'uppercase' }}>Active Drones</div>
                            <div style={{ fontSize: '4rem', color: '#000', fontWeight: 700, lineHeight: 1, marginBottom: '8px', letterSpacing: '-0.02em' }}>842</div>
                            <div style={{ fontSize: '1.2rem', color: '#00cc66', fontWeight: 600 }}>+5 New</div>
                        </div>

                        {/* Bottom Panel: Status */}
                        <div style={{
                            position: 'absolute',
                            bottom: '10%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(20px)',
                            padding: '12px 24px',
                            borderRadius: '30px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00cc66' }}></div>
                            <div style={{ fontSize: '0.9rem', color: '#333', fontWeight: 500, letterSpacing: '0.05em' }}>System Operational</div>
                        </div>
                    </div>
                )}

                {/* Debug: Jump to Dashboard */}
                <button
                    onClick={() => setScene('dashboard')}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        background: 'rgba(255, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 0, 0, 0.4)',
                        color: '#ff8888',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        zIndex: 9999,
                        pointerEvents: 'auto',
                        fontSize: '0.8rem'
                    }}
                >
                    Debug: Jump to Dashboard
                </button>
            </div>
        </main>
    );
}
