'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';

const OpeningScene = dynamic(() => import('@/components/canvas/OpeningScene'), { ssr: false });
const DeliveryScene = dynamic(() => import('@/components/canvas/DeliveryScene'), { ssr: false });
const NetworkScene = dynamic(() => import('@/components/canvas/NetworkScene'), { ssr: false });
const DashboardScene = dynamic(() => import('@/components/canvas/DashboardScene'), { ssr: false });
const TestimonialScene = dynamic(() => import('@/components/canvas/TestimonialScene'), { ssr: false });
const ClosingScene = dynamic(() => import('@/components/canvas/ClosingScene'), { ssr: false });

const SCENES = ['opening', 'delivery', 'hiring', 'dashboard', 'testimonials', 'closing'] as const;
type SceneType = typeof SCENES[number];

const SCENE_LABELS: Record<SceneType, string> = {
    opening: 'The Box',
    delivery: 'The Drone',
    hiring: 'The Network',
    dashboard: 'The Data',
    testimonials: 'The Trust',
    closing: 'The Horizon'
};

export default function Page() {
    const [sceneIndex, setSceneIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [hoveredDot, setHoveredDot] = useState<number | null>(null);

    const handleScroll = useCallback((e: WheelEvent) => {
        if (isScrolling) return;

        // Disable global scroll navigation for 'delivery' scene to allow ScrollControls to work
        if (SCENES[sceneIndex] === 'delivery') return;

        if (e.deltaY > 0) {
            // Scroll Down -> Next Scene
            if (sceneIndex < SCENES.length - 1) {
                setIsScrolling(true);
                setSceneIndex(prev => prev + 1);
                setTimeout(() => setIsScrolling(false), 1200); // Tuned Cooldown
            }
        } else {
            // Scroll Up -> Prev Scene
            if (sceneIndex > 0) {
                setIsScrolling(true);
                setSceneIndex(prev => prev - 1);
                setTimeout(() => setIsScrolling(false), 1200); // Tuned Cooldown
            }
        }
    }, [sceneIndex, isScrolling]);

    useEffect(() => {
        window.addEventListener('wheel', handleScroll);
        return () => window.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    const scene = SCENES[sceneIndex];

    return (
        <main style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={scene}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                >
                    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
                        <Suspense fallback={null}>
                            {scene === 'opening' && <OpeningScene onComplete={() => { }} />}
                            {scene === 'delivery' && <DeliveryScene
                                onComplete={() => setSceneIndex(prev => prev + 1)}
                                onBackward={() => setSceneIndex(prev => prev - 1)}
                            />}
                            {scene === 'hiring' && <NetworkScene onComplete={() => { }} />}
                            {scene === 'dashboard' && <DashboardScene />}
                            {scene === 'testimonials' && <TestimonialScene />}
                            {scene === 'closing' && <ClosingScene />}
                        </Suspense>
                    </Canvas>
                </motion.div>
            </AnimatePresence>

            <Loader />

            {/* UI Overlays */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, color: 'white', fontFamily: 'Inter, sans-serif' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>ZYDER</h1>
            </div>

            {/* Scene 4 UI Overlay (Only visible in 'dashboard' state) */}
            {scene === 'dashboard' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {/* Top Left: Revenue */}
                    <div style={{ position: 'absolute', top: '40px', left: '40px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', opacity: 0.6, marginBottom: '4px' }}>TOTAL REVENUE</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>$4.2M</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#00cc66', marginTop: '4px' }}>+12.5%</div>
                    </div>

                    {/* Top Right: Active Drones */}
                    <div style={{ position: 'absolute', top: '40px', right: '40px', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '0.05em', opacity: 0.6, marginBottom: '4px' }}>ACTIVE DRONES</div>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>842</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#00cc66', marginTop: '4px' }}>ONLINE</div>
                    </div>

                    {/* Bottom Center: System Status */}
                    <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', fontFamily: 'Inter, sans-serif', color: '#1a1a1a', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em', opacity: 0.5, marginBottom: '8px' }}>SYSTEM STATUS</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.05)', padding: '8px 16px', borderRadius: '20px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00cc66' }}></div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>ALL SYSTEMS OPERATIONAL</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Navigation Dots */}
            <div style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                zIndex: 100
            }}>
                {SCENES.map((s, i) => (
                    <div
                        key={s}
                        onClick={() => setSceneIndex(i)}
                        onMouseEnter={() => setHoveredDot(i)}
                        onMouseLeave={() => setHoveredDot(null)}
                        style={{
                            position: 'relative',
                            width: '12px',
                            height: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        {/* Dot */}
                        <div style={{
                            width: i === sceneIndex ? '12px' : '6px',
                            height: i === sceneIndex ? '12px' : '6px',
                            borderRadius: '50%',
                            background: i === sceneIndex ? '#fff' : 'rgba(255,255,255,0.3)',
                            transition: 'all 0.3s ease',
                            boxShadow: i === sceneIndex ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                        }} />

                        {/* Label (Tooltip) */}
                        <AnimatePresence>
                            {(hoveredDot === i || i === sceneIndex) && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: -25 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    style={{
                                        position: 'absolute',
                                        right: '0',
                                        whiteSpace: 'nowrap',
                                        color: '#fff',
                                        fontFamily: 'Inter, sans-serif',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        pointerEvents: 'none',
                                        textShadow: '0 0 5px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {SCENE_LABELS[s]}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </main>
    );
}
