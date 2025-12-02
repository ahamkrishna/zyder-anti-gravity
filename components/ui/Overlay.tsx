import React from 'react';

export default function Overlay() {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none' }}>
            {/* Section 1: The Hero */}
            <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10vw' }}>
                <h1 style={{ fontSize: '12vw', fontWeight: 300, letterSpacing: '-0.05em', lineHeight: 0.9, mixBlendMode: 'difference', color: '#fff' }}>
                    ZYDER
                </h1>
                <p style={{ fontSize: '1.5rem', marginTop: '2rem', maxWidth: '400px', mixBlendMode: 'difference', color: '#fff' }}>
                    The Intelligence of Logistics.
                </p>
            </section>

            {/* Section 2: The Network */}
            <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 10vw' }}>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontSize: '5vw', fontWeight: 300, marginBottom: '1rem' }}>
                        NEURAL<br />NETWORK
                    </h2>
                    <p style={{ fontSize: '1.2rem', maxWidth: '400px', marginLeft: 'auto' }}>
                        Our AI core processes millions of routes in real-time, adapting to traffic, weather, and demand instantly.
                    </p>
                </div>
            </section>

            {/* Section 3: The Velocity */}
            <section style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: '0 10vw' }}>
                <div>
                    <h2 style={{ fontSize: '5vw', fontWeight: 300, marginBottom: '1rem' }}>
                        LIQUID<br />VELOCITY
                    </h2>
                    <p style={{ fontSize: '1.2rem', maxWidth: '400px' }}>
                        Frictionless delivery. From warehouse to doorstep in a continuous, unbroken stream.
                    </p>
                </div>
            </section>

            {/* Section 4: The Future */}
            <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ fontSize: '8vw', fontWeight: 300, textAlign: 'center' }}>
                    JOIN THE<br />CORE
                </h2>
                <button style={{
                    marginTop: '3rem',
                    padding: '1rem 3rem',
                    fontSize: '1.2rem',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                }}>
                    Get Early Access
                </button>
            </section>
        </div>
    );
}
