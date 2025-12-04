'use client';

import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';

interface DataCardProps {
    position: [number, number, number];
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    width?: string;
}

export default function DataCard({ position, label, value, trend, trendUp = true, width = '220px' }: DataCardProps) {
    return (
        <group position={position}>
            <Html
                transform
                style={{
                    width,
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{
                        background: '#111111', // Solid Matte Black
                        border: '1px solid #333333', // Subtle Border
                        borderRadius: '4px', // Sharp, professional corners
                        padding: '24px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)', // Deep shadow for depth
                        fontFamily: '"Inter", sans-serif',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}
                >
                    {/* Label */}
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: '#888888' // Muted label
                    }}>
                        {label}
                    </div>

                    {/* Value */}
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                        color: '#ffffff' // Pure White
                    }}>
                        {value}
                    </div>

                    {/* Trend / Footer */}
                    {trend && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: trendUp ? '#4ade80' : '#f87171' // Green or Red
                        }}>
                            <span>{trendUp ? '↑' : '↓'}</span>
                            <span>{trend}</span>
                        </div>
                    )}
                </motion.div>
            </Html>
        </group>
    );
}
