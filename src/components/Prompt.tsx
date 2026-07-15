import React from 'react';

interface PromptProps {
  user?: string;
  host?: string;
}

/**
 * ===== Prompt Component =====
 * Renders the command line prompt label (e.g., guest@rohan-os:~$).
 * Uses CSS variables for interactive theme colors.
 */
export const Prompt: React.FC<PromptProps> = ({ user = 'guest', host = 'rohan-os' }) => {
  return (
    <span className="font-mono font-bold mr-2 select-none whitespace-nowrap">
      <span style={{ color: 'var(--terminal-accent)' }}>{user}</span>
      <span style={{ color: 'var(--terminal-fg)' }}>@</span>
      <span style={{ color: 'var(--terminal-accent)' }}>{host}</span>
      <span style={{ color: 'var(--terminal-fg)' }}>:~$</span>
    </span>
  );
};

export default Prompt;
