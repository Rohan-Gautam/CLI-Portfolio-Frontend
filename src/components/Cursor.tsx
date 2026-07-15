import React from 'react';

/**
 * ===== Cursor Component =====
 * A retro block cursor that blinks.
 * The styling uses standard theme colors and responds to the active terminal text color.
 */
export const Cursor: React.FC = () => {
  return (
    <span
      className="inline-block w-2.5 h-4.5 align-middle ml-1 select-none animate-terminal-blink"
      style={{
        backgroundColor: 'var(--terminal-accent, currentColor)',
        boxShadow: '0 0 4px var(--terminal-accent, currentColor)',
      }}
    />
  );
};

export default Cursor;
