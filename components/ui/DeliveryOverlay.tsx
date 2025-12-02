import React from 'react';

export default function DeliveryOverlay() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none', color: '#fff' }}>

            {/* Section 1: Automated Delivery */}
            <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '10vw' }}>
                <div>
                    <h2 style={{ fontSize: '4vw', fontWeight: 300, color: '#FF3300' }}>Automated Delivery<br />Agent Management</h2>
                    <p style={{ fontSize: '1.5rem', marginTop: '1rem', opacity: 0.8 }}>Zero Confusion. Zero Delay.</p>
                </div>
            </section>

            {/* Section 2: Lightning Fast */}
            <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '10vw' }}>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '5vw', fontWeight: 700, fontStyle: 'italic' }}>LIGHTNING<br />FAST</h2>
                    <p style={{ fontSize: '1.5rem', marginTop: '1rem', opacity: 0.8 }}>Operations at the speed of thought.</p>
                </div>
            </section>

            {/* Section 3: Dashboard Reveal */}
            <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    background: 'rgba(20, 20, 20, 0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '3rem',
                    borderRadius: '20px',
                    border: '1px solid #333',
                    width: '60vw'
                }}>
                    <h3 style={{ fontSize: '2rem', marginBottom: '2rem', borderBottom: '1px solid #333', paddingBottom: '1rem' }}>Live Metrics</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>Active Agents</div>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#FF3300' }}>1,248</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>Payout Accuracy</div>
                            <div style={{ fontSize: '3rem', fontWeight: 700, color: '#00FF88' }}>99.9%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>COD Compliance</div>
                            <div style={{ fontSize: '3rem', fontWeight: 700 }}>100%</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.9rem', color: '#888' }}>Avg. Delivery Time</div>
                            <div style={{ fontSize: '3rem', fontWeight: 700 }}>18m</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Map Destination */}
            <section style={{ height: '100vh', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '10vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        background: '#00FF88',
                        color: '#000',
                        padding: '1rem 2rem',
                        borderRadius: '50px',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
                    }}>
                        Delivery Completed. Vendor Notified.
                    </div>
                </div>
            </section>

        </div>
    );
}
