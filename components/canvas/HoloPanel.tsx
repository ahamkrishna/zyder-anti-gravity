'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';

interface HoloPanelProps {
    position: [number, number, number];
    title: string;
    children: React.ReactNode;
    width?: string;
    height?: string;
    align?: 'left' | 'right' | 'center';
}

export default function HoloPanel({ position, title, children, width = '200px', height = 'auto', align = 'left' }: HoloPanelProps) {
    return (
        <group position={position}>
            <Html
                transform
                occlude="blending"
                style={{
                    width,
                    height,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                        background: 'rgba(0, 20, 40, 0.7)', // Dark Blue Glass
                        border: '1px solid rgba(0, 240, 255, 0.3)', // Cyan Border
                        borderRadius: '8px',
                        padding: '16px',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        boxShadow: '0 0 20px rgba(0, 240, 255, 0.1), inset 0 0 20px rgba(0, 240, 255, 0.05)',
                        fontFamily: '"Rajdhani", "Inter", sans-serif',
                        color: '#e0faff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        textAlign: align
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: align === 'right' ? 'flex-end' : (align === 'center' ? 'center' : 'flex-start'),
                        gap: '8px',
                        borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
                        paddingBottom: '8px',
                        marginBottom: '4px'
                    }}>
                        <div style={{ width: '6px', height: '6px', background: '#00f0ff', borderRadius: '50%', boxShadow: '0 0 8px #00f0ff' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00f0ff' }}>
                            {title}
                        </span>
                    </div>

                    {/* Content */}
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, lineHeight: 1.4 }}>
                        {children}
                    </div>

                    {/* Decorative Corner */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-1px',
                        right: '-1px',
                        width: '10px',
                        height: '10px',
                        borderBottom: '2px solid #00f0ff',
                        borderRight: '2px solid #00f0ff'
                    }} />
                </motion.div>
            </Html>
        </group>
    );
}
