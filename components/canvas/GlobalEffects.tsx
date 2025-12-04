'use client';

import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Vector2 } from 'three';
import { useMemo } from 'react';

type SceneType = 'opening' | 'delivery' | 'fleet' | 'hiring' | 'dashboard' | 'ai_core' | 'testimonials' | 'closing';

interface GlobalEffectsProps {
    scene: string;
}

export default function GlobalEffects({ scene }: GlobalEffectsProps) {
    // Adaptive Settings based on Scene
    const { bloomIntensity, bloomThreshold, noiseOpacity } = useMemo(() => {
        const isDark = ['opening', 'fleet', 'ai_core', 'hiring'].includes(scene);
        const isBright = ['delivery', 'dashboard', 'testimonials', 'closing'].includes(scene);

        if (isDark) {
            return {
                bloomIntensity: 1.5,
                bloomThreshold: 0.2, // Glows easily
                noiseOpacity: 0.03 // Visible grain
            };
        } else {
            return {
                bloomIntensity: 0.4, // Subtle glow
                bloomThreshold: 0.8, // Only very bright things glow
                noiseOpacity: 0.015 // Subtle grain
            };
        }
    }, [scene]);

    return (
        <EffectComposer enableNormalPass={false}>
            <Bloom
                luminanceThreshold={bloomThreshold}
                mipmapBlur
                intensity={bloomIntensity}
                radius={0.6}
            />
            <Noise opacity={noiseOpacity} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    );
}
