'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, PerspectiveCamera, Environment, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function ClosingScene() {
    const [hovered, setHovered] = useState(false);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

            {/* Warm, Golden Hour Atmosphere */}
            <color attach="background" args={['#1a0b00']} />
            <fog attach="fog" args={['#1a0b00', 5, 25]} />

            {/* Sunrise Lighting */}
            <ambientLight intensity={0.5} color="#ffaa00" />
            <spotLight
                position={[10, 5, 10]}
                angle={0.3}
                penumbra={1}
                intensity={2}
                color="#ffddaa"
                castShadow
            />
            <pointLight position={[-10, -5, -10]} intensity={0.5} color="#ff4400" />

            {/* Floating Particles (Dust Motes in Sunbeam) */}
            <Sparkles count={100} scale={10} size={2} speed={0.4} opacity={0.5} color="#ffcc00" />

            {/* Conversion Card */}
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                <Html transform distanceFactor={2.5} style={{ pointerEvents: 'auto' }}>
                    <div
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{
                            width: '400px',
                            padding: '40px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 200, 100, 0.2)',
                            borderRadius: '24px',
                            textAlign: 'center',
                            color: '#fff',
                            fontFamily: 'Inter, sans-serif',
                            boxShadow: hovered ? '0 20px 50px rgba(255, 100, 0, 0.2)' : '0 10px 30px rgba(0,0,0,0.3)',
                            transition: 'all 0.5s ease',
                            transform: hovered ? 'scale(1.02)' : 'scale(1)',
                        }}
                    >
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 800,
                            marginBottom: '10px',
                            background: 'linear-gradient(to right, #fff, #ffaa00)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Ready to Scale?
                        </h1>
                        <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '30px', lineHeight: '1.5' }}>
                            Join the next generation of delivery management.
                            <br />
                            Experience the future today.
                        </p>

                        {/* Input Field */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '0.9rem',
                                }}
                            />
                        </div>

                        {/* CTA Button */}
                        <button style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #ff8800, #ff4400)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(255, 68, 0, 0.4)',
                            transition: 'transform 0.2s',
                        }}>
                            Get Early Access
                        </button>

                        <div style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.5 }}>
                            No credit card required. 14-day free trial.
                        </div>
                    </div>
                </Html>
            </Float>

            <Environment preset="sunset" blur={0.8} />
        </>
    );
}
