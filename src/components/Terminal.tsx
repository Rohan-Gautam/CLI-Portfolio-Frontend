import React, { useEffect, useRef } from 'react';
import type {
  ProfileResponse,
  CliConfigResponse,
  ThemeInfo,
} from '../types';
import { useTerminal } from '../hooks/useTerminal';
import Output from './Output';
import Prompt from './Prompt';
import Cursor from './Cursor';
import { playKeypressSound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface TerminalProps {
  profile: ProfileResponse;
  cliConfig: CliConfigResponse;
  onThemeChange: (theme: ThemeInfo) => void;
}

/**
 * ===== Terminal Component =====
 * The retro terminal interface containing the scrollable workspace console
 * and the interactive shell input row. Clicking anywhere on the terminal focuses the input.
 * 
 * Architectural Theme System Flow (Propagations):
 * 1. The central Theme State lives in the global ThemeProvider wrapper of App.tsx.
 * 2. ThemePicker renders visual card buttons mapping themes from this provider.
 * 3. Clicking a Theme Card button triggers its onClick event handler, which calls setTheme(themeName).
 * 4. setTheme() updates the activeTheme state inside ThemeProvider.
 * 5. ThemeProvider reacts to activeTheme updates by rewriting variables on document.documentElement:
 *    --terminal-bg, --terminal-fg, and --terminal-accent.
 * 6. Because this Terminal component and the useTerminal hook call useTheme(), they subscribe to
 *    the activeTheme context. Consequently, the entire terminal instantly re-renders when the state shifts,
 *    causing the whole screen to repaint and update visual card active boundaries dynamically.
 */
export const Terminal: React.FC<TerminalProps> = ({
  profile,
  cliConfig,
  onThemeChange,
}) => {
  // Subscribe component directly to activeTheme changes to trigger reactive repaint renders
  const { activeTheme } = useTheme();

  useEffect(() => {
    if (activeTheme) {
      console.log(`Terminal component reactive update: Active theme is now "${activeTheme.name}"`);
    }
  }, [activeTheme]);
  const {
    lines,
    input,
    setInput,
    inputRef,
    executeCommand,
    handleAutocomplete,
    handleHistoryNavigation,
    focusInput,
  } = useTerminal({
    profile,
    cliConfig,
    onThemeChange,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the log list when new entries are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  // Listen to focus-terminal-input events dispatched from App.tsx when music is toggled
  useEffect(() => {
    const handleFocusRequest = () => {
      focusInput();
    };
    window.addEventListener('focus-terminal-input', handleFocusRequest);
    return () => {
      window.removeEventListener('focus-terminal-input', handleFocusRequest);
    };
  }, [focusInput]);



  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playKeypressSound(e.key);
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleAutocomplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleHistoryNavigation('up');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleHistoryNavigation('down');
    }
  };

  return (
    <div
      onClick={focusInput}
      className="w-full h-full pl-10 pr-10 pb-6 pt-0 flex flex-col font-mono cursor-text select-text overflow-hidden"
      style={{
        color: 'var(--terminal-fg)',
        backgroundColor: 'var(--terminal-bg)',
        textShadow: '0 0 2px var(--terminal-fg)', // Subtle phosphor blur glow
      }}
    >
      {/* Scrollable logs viewport */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-1 mb-2 scroll-smooth"
      >
        {lines.map((line) => (
          <Output key={line.id} line={line} />
        ))}
      </div>

      {/* Console Input Row */}
      <div className="flex items-center mt-auto border-t pt-2 border-opacity-10" style={{ borderTopColor: 'var(--terminal-fg)' }}>
        <Prompt />
        <div className="relative flex-1 flex items-center overflow-hidden">
          {/* Visible Command text representation */}
          <span
            className="font-mono text-[13px] md:text-[14px] whitespace-pre break-all select-none"
            style={{ color: 'var(--terminal-fg)' }}
          >
            {input}
          </span>
          {/* Cursor element aligned right next to input characters */}
          <Cursor />

          {/* Invisible interactive input overlay */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full opacity-0 bg-transparent text-transparent border-none outline-none font-mono text-[13px] md:text-[14px] cursor-text"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
