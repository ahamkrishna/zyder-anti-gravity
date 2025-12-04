'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera, Environment, Float, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

function NeuralNetwork() {
    const groupRef = useRef<THREE.Group>(null);

    // Generate nodes
    const nodes = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * 10;
            const y = (Math.random() - 0.5) * 10;
            const z = (Math.random() - 0.5) * 10;
            temp.push(new THREE.Vector3(x, y, z));
        }
        return temp;
    }, []);

    // Generate connections (synapses)
    const connections = useMemo(() => {
        const lines = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = nodes[i].distanceTo(nodes[j]);
                if (dist < 4) { // Connect if close enough
                    lines.push([nodes[i], nodes[j]]);
                }
            }
        }
        return lines;
    }, [nodes]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
            groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Nodes */}
            {nodes.map((pos, i) => (
                <mesh key={i} position={pos}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial
                        color="#00ff88"
                        emissive="#00ff88"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
            ))}

            {/* Synapses (Lines) */}
            {connections.map((line, i) => (
                <Line
                    key={i}
                    points={line}
                    color="#00ff88"
                    opacity={0.2}
                    transparent
                    lineWidth={1}
                />
            ))}

            {/* Central Core Glow */}
            <mesh>
                <sphereGeometry args={[2, 32, 32]} />
                <meshBasicMaterial color="#00ff88" transparent opacity={0.05} depthWrite={false} />
            </mesh>
        </group>
    );
}

export default function AIScene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />

            <color attach="background" args={['#000502']} /> {/* Deep Matrix Green/Black */}
            <fog attach="fog" args={['#000502', 5, 30]} />

            {/* Digital Lighting */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00ff88" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0044ff" />

            <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
                <NeuralNetwork />
            </Float>

            {/* Content Overlay */}
            <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none', zIndex: 0, width: '100%' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}>
                    <div style={{
                        fontFamily: 'Inter, sans-serif',
                        color: '#fff',
                        textAlign: 'center',
                        textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
                        background: 'rgba(0, 20, 10, 0.6)',
                        backdropFilter: 'blur(10px)',
                        padding: '40px 60px',
                        borderRadius: '20px',
                        border: '1px solid rgba(0, 255, 136, 0.3)',
                        boxShadow: '0 0 50px rgba(0, 255, 136, 0.1)',
                        maxWidth: '80vw',
                        boxSizing: 'border-box'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 5vw, 4rem)',
                            fontWeight: 800,
                            margin: 0,
                            letterSpacing: '2px',
                            color: '#00ff88',
                            textTransform: 'uppercase'
                        }}>
                            Neural<br />Intelligence
                        </h1>
                        <div style={{
                            width: '50px',
                            height: '4px',
                            background: '#00ff88',
                            margin: '20px auto',
                            borderRadius: '2px'
                        }} />
                        <p style={{
                            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                            fontWeight: 400,
                            margin: 0,
                            opacity: 0.9,
                            color: '#ccffdd'
                        }}>
                            Optimizing every route.<br />
                            In real-time.
                        </p>
                    </div>
                </div>
            </Html>

            <Environment preset="city" blur={1} />
        </>
    );
}
