'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, PerspectiveCamera, Environment, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function DataGlobe() {
    const globeRef = useRef<THREE.Group>(null);

    // Generate surface points for the "Data" look
    const { positions, colors } = useMemo(() => {
        const count = 2000; // Reduced count for smaller globe
        const radius = 2.6; // Much smaller radius (was 8.2)
        const pts = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        const color = new THREE.Color('#00FF88');

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            pts[i * 3] = x;
            pts[i * 3 + 1] = y;
            pts[i * 3 + 2] = z;

            // Color gradient
            const t = (y + radius) / (radius * 2);
            color.setHSL(0.4 + t * 0.1, 1, 0.5);

            cols[i * 3] = color.r;
            cols[i * 3 + 1] = color.g;
            cols[i * 3 + 2] = color.b;
        }
        return { positions: pts, colors: cols };
    }, []);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        return geo;
    }, [positions, colors]);

    useFrame((state) => {
        if (globeRef.current) {
            globeRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={globeRef}>
            {/* Main Glass Sphere */}
            <mesh>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshPhysicalMaterial
                    color="#001133"
                    roughness={0.1}
                    metalness={0.1}
                    transmission={0.6} // Glass-like
                    thickness={2}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh>
                <sphereGeometry args={[2.3, 32, 32]} />
                <meshBasicMaterial color="#002244" transparent opacity={0.9} />
            </mesh>

            {/* Data Points Layer */}
            <points geometry={geometry}>
                <pointsMaterial
                    size={0.08}
                    vertexColors
                    transparent
                    opacity={0.6}
                    sizeAttenuation={true}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Latitude/Longitude Lines (Wireframe) */}
            <mesh>
                <sphereGeometry args={[2.55, 24, 24]} />
                <meshBasicMaterial color="#00FF88" wireframe transparent opacity={0.05} />
            </mesh>
        </group>
    );
}

function ConnectionLines() {
    // Decorative curved lines connecting random points
    // Simplified for performance: just a few rotating rings
    return (
        <group>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[3.5, 0.01, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
            </mesh>
            <mesh rotation={[-Math.PI / 4, 0, 0]}>
                <torusGeometry args={[4.0, 0.01, 16, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
            </mesh>
        </group>
    )
}

function GoldenRipple({ position, onComplete }: { position: [number, number, number], onComplete: () => void }) {
    const [scale, setScale] = useState(0);
    const [opacity, setOpacity] = useState(1);

    useFrame((state, delta) => {
        if (scale < 12) {
            setScale(s => s + delta * 25); // Faster expansion
            setOpacity(o => Math.max(0, o - delta * 2.5));
        } else {
            onComplete();
        }
    });

    if (opacity <= 0) return null;

    return (
        <group position={position} rotation={[Math.PI / 2, 0, 0]}>
            {/* Main Ring */}
            <mesh scale={[scale, scale, scale]}>
                <ringGeometry args={[0.8, 1, 64]} />
                <meshBasicMaterial color="#FFD700" transparent opacity={opacity} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>

            {/* Secondary Ring (Lagging) */}
            <mesh scale={[scale * 0.7, scale * 0.7, scale * 0.7]}>
                <ringGeometry args={[0.9, 0.95, 64]} />
                <meshBasicMaterial color="#FFAA00" transparent opacity={opacity * 0.5} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>

            {/* Central Flash */}
            <mesh scale={[scale * 0.3, scale * 0.3, scale * 0.3]} position={[0, 0, 0.1]}>
                <circleGeometry args={[1, 32]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={opacity * 0.8} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
        </group>
    );
}

function LineToCenter({ position }: { position: [number, number, number] }) {
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const points = new Float32Array([0, 0, 0, -position[0], -position[1], -position[2]]);
        geo.setAttribute('position', new THREE.BufferAttribute(points, 3));
        return geo;
    }, [position]);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="#00FF88" transparent opacity={0.3} linewidth={1} />
        </lineSegments>
    );
}

function AgentRequest({ id, name, role, position, onApprove, onReject }: { id: number, name: string, role: string, position: [number, number, number], onApprove: (id: number, pos: [number, number, number]) => void, onReject: (id: number) => void }) {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            {/* Agent Node (Static, no Float) */}
            <mesh
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.2 : 1}
            >
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color={hovered ? "#00FF88" : "#ffffff"} emissive={hovered ? "#00FF88" : "#ffffff"} emissiveIntensity={0.5} toneMapped={false} />
            </mesh>

            {/* Connection Line to Center */}
            <LineToCenter position={position} />

            {/* UI Panel */}
            <Html position={[0.5, 0, 0]} transform style={{ pointerEvents: 'auto' }} zIndexRange={[100, 0]}>
                <div style={{
                    background: 'rgba(20, 20, 30, 0.6)', // Lighter, more glass-like
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)', // Highlight
                    padding: '12px', // Reduced padding
                    borderRadius: '12px',
                    color: 'white',
                    width: '180px', // Reduced width
                    fontFamily: 'Inter, sans-serif',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    transform: hovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: '#00FF88', marginRight: '6px',
                            boxShadow: '0 0 8px #00FF88'
                        }}></div>
                        <div style={{
                            fontSize: '0.55rem', color: '#00FF88', fontWeight: 700,
                            letterSpacing: '0.15em', textTransform: 'uppercase'
                        }}>New Request</div>
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px', letterSpacing: '-0.02em' }}>{name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '10px' }}>{role}</div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); onApprove(id, position); }}
                            style={{
                                flex: 1,
                                background: 'rgba(0, 255, 136, 0.15)',
                                border: '1px solid rgba(0, 255, 136, 0.3)',
                                borderRadius: '6px',
                                padding: '6px',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                fontWeight: 600,
                                color: '#00FF88',
                                transition: 'all 0.2s',
                                backdropFilter: 'blur(4px)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#00FF88';
                                e.currentTarget.style.color = '#000';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 255, 136, 0.15)';
                                e.currentTarget.style.color = '#00FF88';
                            }}
                        >
                            Accept
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onReject(id); }}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                padding: '6px',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontWeight: 600,
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 50, 0, 0.5)';
                                e.currentTarget.style.color = '#FF3300';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                            }}
                        >
                            Ignore
                        </button>
                    </div>
                </div>
            </Html>
        </group>
    );
}

export default function NetworkScene({ onComplete }: { onComplete?: () => void }) {
    const [ripples, setRipples] = useState<{ id: number, pos: [number, number, number] }[]>([]);
    const [agents, setAgents] = useState([
        { id: 1, name: 'Sarah K.', role: 'Logistics Specialist', position: [-5, 2, 3] as [number, number, number] },
        { id: 2, name: 'Mike R.', role: 'Drone Operator', position: [5, -1, 2] as [number, number, number] },
        { id: 3, name: 'David L.', role: 'Route Optimizer', position: [0, 3.5, -4] as [number, number, number] },
        { id: 4, name: 'Elena V.', role: 'Supply Chain Manager', position: [-3, -3, 4] as [number, number, number] },
    ]);

    // Check for completion
    useEffect(() => {
        if (agents.length === 0 && onComplete) {
            const timeout = setTimeout(() => {
                onComplete();
            }, 1500); // 1.5s delay after last action
            return () => clearTimeout(timeout);
        }
    }, [agents, onComplete]);

    const handleApprove = (id: number, pos: [number, number, number]) => {
        setRipples(prev => [...prev, { id: Date.now(), pos }]);
        setTimeout(() => {
            setAgents(prev => prev.filter(a => a.id !== id));
        }, 400);
    };

    const handleReject = (id: number) => {
        setAgents(prev => prev.filter(a => a.id !== id));
    };

    const removeRipple = (rippleId: number) => {
        setRipples(prev => prev.filter(r => r.id !== rippleId));
    };

    return (
        <>
            <color attach="background" args={['#020202']} />
            <fog attach="fog" args={['#020202', 5, 30]} />

            <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
            <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} autoRotate autoRotateSpeed={0.5} />

            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00FF88" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0088FF" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <group>
                <DataGlobe />
                <ConnectionLines />
            </group>

            {agents.map(agent => (
                <AgentRequest
                    key={agent.id}
                    id={agent.id}
                    name={agent.name}
                    role={agent.role}
                    position={agent.position}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            ))}

            {ripples.map(ripple => (
                <GoldenRipple
                    key={ripple.id}
                    position={ripple.pos}
                    onComplete={() => removeRipple(ripple.id)}
                />
            ))}

            <Environment preset="city" environmentIntensity={0.2} />
        </>
    );
}
