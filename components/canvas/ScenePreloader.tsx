'use client';

import { useEffect, useRef } from 'react';

const SCENE_IMPORTS = [
    () => import('@/components/canvas/OpeningScene'),
    () => import('@/components/canvas/DeliveryScene'),
    () => import('@/components/canvas/FleetScene'),
    () => import('@/components/canvas/NetworkScene'),
    () => import('@/components/canvas/DashboardScene'),
    () => import('@/components/canvas/AIScene'),
    () => import('@/components/canvas/TestimonialScene'),
    () => import('@/components/canvas/ClosingScene'),
];

export default function ScenePreloader() {
    const hasStartedRef = useRef(false);

    useEffect(() => {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;

        const loadSequence = async () => {
            // Start from index 1 (Delivery) since index 0 (Opening) is loaded initially
            for (let i = 1; i < SCENE_IMPORTS.length; i++) {
                try {
                    // Small delay between chunks to keep UI responsive and avoid network congestion
                    await new Promise(resolve => setTimeout(resolve, 800));

                    const preload = SCENE_IMPORTS[i];
                    await preload();
                    console.log(`Smart Preloader: Cached Scene ${i}`);
                } catch (err) {
                    console.warn(`Smart Preloader: Failed Scene ${i}`, err);
                }
            }
        };

        // Initial delay to let the opening animation start smoothly
        const timeout = setTimeout(() => {
            loadSequence();
        }, 3000);

        return () => clearTimeout(timeout);
    }, []);

    return null;
}
