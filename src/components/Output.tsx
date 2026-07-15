import React from 'react';
import type { TerminalLine } from '../types';
import Prompt from './Prompt';
import ThemePicker from './ThemePicker';

interface OutputProps {
  line: TerminalLine;
}

/**
 * ===== Output Component =====
 * Renders individual terminal lines based on their type.
 * All formatting and colors read from CSS variables, supporting
 * dynamic, backend-only real-time transitions.
 */
export const Output: React.FC<OutputProps> = ({ line }) => {
  if (line.type === 'theme-picker') {
    return <ThemePicker />;
  }

  if (line.type === 'input') {
    return (
      <div className="flex items-start font-mono my-1 text-[13px] md:text-[14px]">
        <Prompt />
        <span
          className="font-semibold break-all"
          style={{ color: 'var(--terminal-fg)' }}
        >
          {line.text}
        </span>
      </div>
    );
  }

  if (line.type === 'system') {
    return (
      <div
        className="font-mono text-[12px] md:text-[13px] my-1 opacity-90 italic animate-pulse"
        style={{ color: 'var(--terminal-accent)' }}
      >
        {line.text}
      </div>
    );
  }

  if (line.type === 'error') {
    return (
      <div
        className="font-mono text-[12px] md:text-[13px] my-1 font-semibold"
        style={{ color: 'var(--terminal-accent)' }}
      >
        {line.text}
      </div>
    );
  }

  // Standard output line: pre-formatted to preserve whitespace, indentation and line breaks
  return (
    <pre
      className="font-mono text-[12px] md:text-[13px] leading-relaxed my-1 whitespace-pre-wrap break-words"
      style={{ color: 'var(--terminal-fg)' }}
    >
      {line.text}
    </pre>
  );
};

export default Output;
