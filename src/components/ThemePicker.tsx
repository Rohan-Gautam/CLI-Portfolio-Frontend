import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { playKeypressSound } from '../utils/audio';

/**
 * ===== ThemePicker =====
 * Inline React component that renders a grid of interactive theme cards.
 * Displays each theme's name and bubbles previewing the color variables.
 * 
 * Theme State Propagation:
 * 1. Theme definitions are loaded dynamically from the backend config.
 * 2. The active theme state is stored globally in the single ThemeContext provider.
 * 3. When a user clicks a theme card button:
 *    - We call e.preventDefault() and e.stopPropagation() to prevent focus theft.
 *    - We call setTheme(t.name) from useTheme() to apply the selected theme.
 * 4. ThemeContext catches this action, updating document.documentElement's CSS variables
 *    (--terminal-bg, --terminal-fg, and --terminal-accent).
 * 5. Downstream components consume these variables. Since the update happens at the browser DOM layer,
 *    all elements repaint reactively and instantly without any page refresh or component remount.
 * 6. After the theme is switched, we dispatch the 'focus-terminal-input' event to keep typing active.
 */
export const ThemePicker: React.FC = () => {
  const { themes, activeTheme, setTheme } = useTheme();

  const handleSelectTheme = (e: React.MouseEvent, themeName: string) => {
    // Prevent focus shifts and bubbling to parent elements
    e.preventDefault();
    e.stopPropagation();

    // Play mechanical audio click on selection
    playKeypressSound('Enter');
    setTheme(themeName);

    // Notify terminal component to re-focus its input element immediately
    window.dispatchEvent(new Event('focus-terminal-input'));
  };

  return (
    <div className="flex flex-wrap gap-3 py-2 max-w-full font-mono text-[12px]">
      {themes.map((t) => {
        const isActive = activeTheme?.name.toLowerCase() === t.name.toLowerCase();
        
        return (
          <button
            key={t.name}
            type="button"
            onClick={(e) => handleSelectTheme(e, t.name)}
            className="flex flex-col p-3 rounded-lg text-left transition-all duration-300 border-2 select-none min-w-[125px] max-w-[150px] flex-1 cursor-pointer outline-none hover:scale-105 hover:opacity-100 opacity-90"
            style={{
              backgroundColor: t.background,
              color: t.foreground,
              borderColor: isActive ? 'var(--terminal-accent)' : `${t.foreground}2b`, // Faint border when inactive
              boxShadow: isActive ? '0 0 10px var(--terminal-accent)' : 'none',
            }}
          >
            {/* Header info */}
            <div className="flex items-center justify-between gap-1 w-full font-bold text-[10px] uppercase tracking-wider mb-2">
              <span className="truncate" title={t.name}>{t.name}</span>
              {isActive && (
                <span className="font-extrabold text-[12px]" style={{ color: t.accent }}>
                  ✓
                </span>
              )}
            </div>

            {/* Colors Preview Row */}
            <div className="flex items-center gap-1.5 mt-auto bg-black/15 p-1 rounded w-full justify-around border border-white/5">
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: t.background }}
                />
                <span className="text-[7px] opacity-60">BG</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: t.foreground }}
                />
                <span className="text-[7px] opacity-60">FG</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: t.accent }}
                />
                <span className="text-[7px] opacity-60">ACC</span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ThemePicker;
