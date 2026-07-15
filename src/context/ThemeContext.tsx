import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ThemeInfo } from '../types';

interface ThemeContextType {
  activeTheme: ThemeInfo | null;
  themes: ThemeInfo[];
  setThemesList: (themes: ThemeInfo[]) => void;
  setActiveTheme: (theme: ThemeInfo) => void;
  setTheme: (name: string) => boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ===== ThemeProvider =====
 * Centralized theme manager context.
 * Sets CSS custom variables (--terminal-bg, --terminal-fg, --terminal-accent) globally
 * on root HTML elements and handles theme selection logic.
 *
 * Theme state is stored in this React context.
 * Clicking a theme card triggers setTheme(theme.name) which updates activeTheme state.
 * React reactively propagates this state change, updating the DOM properties.
 * Since the terminal components only read values via var(--terminal-*), they 
 * instantly repaint without needing any page refresh or component remount.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveThemeState] = useState<ThemeInfo | null>(null);
  const [themes, setThemes] = useState<ThemeInfo[]>([]);

  // Update HTML CSS custom property variables whenever active theme changes
  useEffect(() => {
    if (activeTheme) {
      try {
        console.log(`Applying theme: ${activeTheme.name}`);
        const root = document.documentElement;
        root.style.setProperty('--terminal-bg', activeTheme.background);
        root.style.setProperty('--terminal-fg', activeTheme.foreground);
        root.style.setProperty('--terminal-accent', activeTheme.accent);

        if (document.body) {
          document.body.style.setProperty('--terminal-bg', activeTheme.background);
          document.body.style.setProperty('--terminal-fg', activeTheme.foreground);
          document.body.style.setProperty('--terminal-accent', activeTheme.accent);
        }
        console.log('CSS variables updated.');
      } catch (error) {
        console.error('Failed to set CSS variables for theme:', activeTheme.name, error);
      }
    }
  }, [activeTheme]);

  /**
   * Loads the backend config theme list cache and applies Catppuccin on boot.
   * Memoized with useCallback to maintain callback reference stability across renders.
   */
  const setThemesList = useCallback((themesList: ThemeInfo[]) => {
    setThemes(themesList);
    
    // Only set default theme if it hasn't been set yet (initial load)
    // This prevents active user selections from being overridden.
    setActiveThemeState((prev) => {
      if (prev) return prev;
      
      const catppuccin = themesList.find(
        (t) => t.name.toLowerCase() === 'catppuccin' || t.name.toLowerCase() === 'catppuccin-mocha'
      );
      return catppuccin || themesList[0] || null;
    });
  }, []);

  /**
   * Apply theme dynamically by name. Safe against nonexistent inputs.
   * Memoized with useCallback to maintain callback reference stability.
   */
  const setTheme = useCallback((name: string): boolean => {
    const found = themes.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (found) {
      setActiveThemeState(found);
      console.log('Theme updated.');
      return true;
    }
    console.warn(`Theme not found: "${name}". Falling back to visual card selection.`);
    return false;
  }, [themes]);

  return (
    <ThemeContext.Provider
      value={{
        activeTheme,
        themes,
        setThemesList,
        setActiveTheme: setActiveThemeState,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom React Hook to consume theme context actions.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
