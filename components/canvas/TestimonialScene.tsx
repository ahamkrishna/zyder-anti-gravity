'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, PerspectiveCamera, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const TESTIMONIALS = [
    { id: 1, name: "Sarah J.", role: "Frequent Rider", text: "Zyder changed my daily commute. It's so fast and reliable!", rating: 5, location: "New York" },
    { id: 2, name: "Mike T.", role: "Delivery Partner", text: "Best platform to work with. The earnings are transparent.", rating: 5, location: "London" },
    { id: 3, name: "Emily R.", role: "Business User", text: "Our logistics have never been smoother. Highly recommended.", rating: 5, location: "Tokyo" },
];

function MatteCard({ data, position }: { data: any, position: [number, number, number] }) {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle tilt on hover
            const targetRotX = hovered ? -0.1 : 0;
            const targetRotY = hovered ? 0.1 : 0;
            const targetZ = hovered ? position[2] + 0.5 : position[2];

            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.1);
            meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);
        }
    });

    return (
        <group ref={meshRef} position={position}>
            <Float speed={2} rotationIntensity={0.02} floatIntensity={0.1}>
                {/* Matte Card Body - Compact Size */}
                <RoundedBox args={[3.0, 1.8, 0.1]} radius={0.1} smoothness={4}>
                    <meshStandardMaterial
                        color="#1a1a1a"
                        roughness={0.7}
                        metalness={0.1}
                    />
                </RoundedBox>

                {/* Minimalist UI - Refined */}
                <Html transform distanceFactor={2.5} style={{ pointerEvents: 'auto' }} position={[0, 0, 0.06]}>
                    <div
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{
                            width: '280px', // Reduced width
                            height: '170px', // Reduced height
                            padding: '20px', // Tighter padding
                            color: '#ffffff',
                            fontFamily: 'Inter, sans-serif',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            userSelect: 'none',
                            textAlign: 'left',
                        }}
                    >
                        {/* Quote */}
                        <div style={{ fontSize: '0.95rem', lineHeight: '1.4', fontWeight: 300, opacity: 0.9 }}>
                            "{data.text}"
                        </div>

                        {/* Author Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                {data.name.charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{data.name}</div>
                                <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{data.role}</div>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#ffd700', fontSize: '0.8rem' }}>
                                {'★'.repeat(data.rating)}
                            </div>
                        </div>
                    </div>
                </Html>
            </Float>
        </group>
    );
}

function Carousel() {
    return (
        <group position={[0, 0, 0]}>
            <MatteCard data={TESTIMONIALS[0]} position={[-3.5, 0, 0]} />
            <MatteCard data={TESTIMONIALS[1]} position={[0, 0, 0.5]} />
            <MatteCard data={TESTIMONIALS[2]} position={[3.5, 0, 0]} />
        </group>
    );
}

export default function TestimonialScene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />

            {/* Clean, Dark Background */}
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 5, 20]} />

            {/* Soft Studio Lighting */}
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#444" />

            <Carousel />

            <Environment preset="studio" blur={1} />
        </>
    );
}
