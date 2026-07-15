import React from 'react';
import { SCREEN, DEBUG_SCREEN_ALIGNMENT } from '../constants/screenConfig';
import CRTOverlay from './CRTOverlay';

interface CRTMonitorProps {
  children: React.ReactNode;
}

/**
 * ===== CRTMonitor =====
 * Layer order:
 *
 * 1. Black background
 * 2. Terminal viewport
 * 3. CRT glass effects
 * 4. monitor.png (transparent PNG bezel)
 *
 * Because monitor.png has a transparent screen area,
 * the bezel naturally hides the terminal edges.
 */
export const CRTMonitor: React.FC<CRTMonitorProps> = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">

      {/* ==============================
          TERMINAL VIEWPORT
      =============================== */}
      <div
        className="absolute overflow-hidden rounded-[3.5%/4.5%] select-text z-10"
        style={{
          left: SCREEN.left,
          top: SCREEN.top,
          width: SCREEN.width,
          height: SCREEN.height,
          backgroundColor: 'var(--terminal-bg)',
        }}
      >
        {/* Terminal */}
        <div className="absolute inset-0 z-10 overflow-hidden">
          {children}
        </div>

        {/* CRT effects */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <CRTOverlay />
        </div>

        {/* Alignment Debug */}
        {DEBUG_SCREEN_ALIGNMENT && (
          <div className="absolute inset-0 z-50 border-2 border-dashed border-red-500 bg-red-500/20 pointer-events-none flex items-center justify-center">
            <div className="bg-black/80 text-red-500 border border-red-500 rounded px-2 py-1 text-[9px] font-mono">
              <strong>DEBUG</strong>
              <div>
                L:{SCREEN.left} T:{SCREEN.top}
              </div>
              <div>
                W:{SCREEN.width} H:{SCREEN.height}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==============================
          MONITOR BEZEL
          MUST BE ABOVE TERMINAL
      =============================== */}
      <img
        src="/monitor.png"
        alt="Vintage CRT Monitor"
        className="absolute inset-0 w-full h-full object-fill pointer-events-none select-none z-30"
        draggable={false}
      />

    </div>
  );
};

export default CRTMonitor;