'use client';

import { motion } from 'framer-motion';

export default function CockpitHUD() {
    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            padding: '40px 60px',
            boxSizing: 'border-box',
            zIndex: 10
        }}>
            {/* Left Panel: Logistics Data */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                {/* Header */}
                <div style={{ borderBottom: '2px solid #00f0ff', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#00f0ff', letterSpacing: '0.1em' }}>
                        GLOBAL LOGISTICS
                    </h2>
                </div>

                {/* Card 1 */}
                <div style={{
                    background: 'rgba(0, 20, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#88aaff', marginBottom: '5px' }}>ACTIVE DRONES</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif' }}>8,412</div>
                    <div style={{ fontSize: '0.8rem', color: '#00ffaa' }}>▲ +12% this week</div>
                </div>

                {/* Card 2 */}
                <div style={{
                    background: 'rgba(0, 20, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#88aaff', marginBottom: '5px' }}>AVG. DELIVERY TIME</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif' }}>14m 32s</div>
                    <div style={{ fontSize: '0.8rem', color: '#00ffaa' }}>▼ -45s improvement</div>
                </div>
            </motion.div>

            {/* Right Panel: Network Status */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                style={{
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    textAlign: 'right'
                }}
            >
                {/* Header */}
                <div style={{ borderBottom: '2px solid #ff00aa', paddingBottom: '10px', marginBottom: '10px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, color: '#ff00aa', letterSpacing: '0.1em' }}>
                        NETWORK HEALTH
                    </h2>
                </div>

                {/* Card 3 */}
                <div style={{
                    background: 'rgba(0, 20, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 0, 170, 0.2)',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#ff88cc', marginBottom: '5px' }}>SYSTEM UPTIME</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif' }}>99.99%</div>
                    <div style={{ fontSize: '0.8rem', color: '#ff00aa' }}>All systems operational</div>
                </div>

                {/* Card 4 */}
                <div style={{
                    background: 'rgba(0, 20, 40, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 0, 170, 0.2)',
                    padding: '20px',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '0.8rem', color: '#ff88cc', marginBottom: '5px' }}>GLOBAL HUBS</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Inter, sans-serif' }}>142</div>
                    <div style={{ fontSize: '0.8rem', color: '#ff00aa' }}>3 new hubs online</div>
                </div>
            </motion.div>
        </div>
    );
}
