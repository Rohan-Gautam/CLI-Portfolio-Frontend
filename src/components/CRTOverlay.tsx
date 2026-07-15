import React from 'react';

/**
 * ===== CRT Overlay Component =====
 * Implements retro CRT screen effects inside the terminal boundaries.
 * Includes:
 * 1. Scanlines (using CSS background gradients)
 * 2. Vignette (radial shadow mapping)
 * 3. CRT flicker animation (subtle brightness adjustments)
 * 4. Micro-static noise overlay (animated SVG fractal filter)
 */
export const CRTOverlay: React.FC = () => {
  return (
    <>
      {/* 1. Subtle Scanline Grid */}
      <div className="absolute inset-0 pointer-events-none z-30 crt-scanlines opacity-[0.035]" />

      {/* 2. CRT Flicker Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 crt-flicker" />

      {/* 3. Screen Vignette (Shadow at the edges) */}
      <div className="absolute inset-0 pointer-events-none z-40 crt-vignette" />

      {/* 4. Animated Static Noise */}
      <div className="absolute inset-0 pointer-events-none z-30 crt-noise opacity-[0.015]" />

      {/* 5. Phosphor Bloom Glow Wrapper */}
      <div className="absolute inset-0 pointer-events-none z-10 crt-phosphor-glow" />
    </>
  );
};

export default CRTOverlay;
