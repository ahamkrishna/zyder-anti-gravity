'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';

interface GlassCardProps {
    position: [number, number, number];
    label: string;
    value: string;
    subtext?: string;
    align?: 'left' | 'right';
    highlight?: boolean;
}

export default function GlassCard({ position, label, value, subtext, align = 'left', highlight = false }: GlassCardProps) {
    const mainColor = highlight ? '#ff00aa' : '#00f0ff'; // Magenta for highlight, Cyan for normal

    return (
        <group position={position}>
            {/* 3D Anchor Point (Glowing Dot) */}
            <mesh position={[align === 'left' ? 2.5 : -2.5, 0, 0]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color={mainColor} />
            </mesh>

            {/* Connecting Line (3D) */}
            <mesh position={[align === 'left' ? 1.25 : -1.25, 0, 0]}>
                <boxGeometry args={[2.5, 0.01, 0.01]} />
                <meshBasicMaterial color={mainColor} transparent opacity={0.4} />
            </mesh>

            <Html
                transform
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, x: align === 'left' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                        // Minimalist "Tech" Style - No heavy background
                        background: highlight
                            ? `linear-gradient(90deg, rgba(255,0,170,0.1) 0%, rgba(0,0,0,0) 100%)`
                            : `linear-gradient(90deg, rgba(0,240,255,0.05) 0%, rgba(0,0,0,0) 100%)`,
                        borderLeft: align === 'left' ? `2px solid ${mainColor}` : 'none',
                        borderRight: align === 'right' ? `2px solid ${mainColor}` : 'none',
                        padding: '10px 20px',
                        minWidth: '200px',
                        textAlign: align,
                        fontFamily: '"Rajdhani", sans-serif',
                        color: '#fff',
                        transform: highlight ? 'scale(1.1)' : 'scale(1)', // Slight scale up
                    }}
                >
                    <div style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        color: mainColor,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        opacity: 0.9
                    }}>
                        {label}
                    </div>
                    <div style={{
                        fontSize: highlight ? '3.5rem' : '3rem', // Larger text for highlight
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        lineHeight: 0.9,
                        textShadow: `0 0 30px ${highlight ? 'rgba(255, 0, 170, 0.6)' : 'rgba(0, 240, 255, 0.4)'}`,
                        color: '#ffffff'
                    }}>
                        {value}
                    </div>
                    {subtext && (
                        <div style={{
                            fontSize: '0.9rem',
                            color: highlight ? '#ffccdd' : '#88aaff',
                            fontWeight: 500,
                            marginTop: '4px'
                        }}>
                            {subtext}
                        </div>
                    )}
                </motion.div>
            </Html>
        </group>
    );
}
