'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

function DroneSwarm({ count = 100 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random initial positions and speeds
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current) return;

        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

            // Update time
            t = particle.t += speed / 2;

            // Lissajous curve movement for organic swarm feel
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            // Update position
            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Scale based on distance (fake depth of field / size variation)
            const scale = 1 + Math.sin(t) * 0.5;
            dummy.scale.set(scale, scale, scale);

            // Rotation - face direction of movement roughly
            dummy.rotation.set(s * 5, s * 5, s * 5);

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            {/* Simple Drone Shape: A flattened cone/arrow */}
            <coneGeometry args={[0.2, 0.8, 8]} />
            <meshStandardMaterial color="#ff4400" emissive="#ff2200" emissiveIntensity={2} toneMapped={false} />
        </instancedMesh>
    );
}

export default function FleetScene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />

            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 10, 50]} />

            {/* Cinematic Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#44aaff" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#ff4400" />

            {/* The Swarm */}
            <group rotation={[0, 0, Math.PI / 4]}>
                <DroneSwarm count={200} />
            </group>

            {/* Content Overlay */}
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                <Html position={[-3.5, -1.5, 0]} transform distanceFactor={12} style={{ pointerEvents: 'none' }}>
                    <div style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#fff',
                        textAlign: 'left',
                        textShadow: '0 0 20px rgba(255, 68, 0, 0.5)',
                        padding: '20px'
                    }}>
                        <h1 style={{
                            fontSize: '5rem',
                            fontWeight: 900,
                            margin: 0,
                            lineHeight: 0.9,
                            letterSpacing: '-2px',
                            background: 'linear-gradient(to bottom right, #fff, #ff4400)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            INFINITE<br />SCALE
                        </h1>
                        <p style={{
                            fontSize: '1.2rem',
                            fontWeight: 400,
                            marginTop: '20px',
                            opacity: 0.8,
                            letterSpacing: '1px',
                            borderLeft: '4px solid #ff4400',
                            paddingLeft: '20px'
                        }}>
                            Command a fleet of thousands.<br />
                            Synchronized. Optimized. Unstoppable.
                        </p>
                    </div>
                </Html>
            </Float>

            <Environment preset="city" blur={1} />
        </>
    );
}
