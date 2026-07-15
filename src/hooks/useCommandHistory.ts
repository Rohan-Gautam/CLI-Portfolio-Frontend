import { useState, useCallback } from 'react';

/**
 * A custom hook to manage terminal command history, allowing the user to
 * traverse previously typed commands using the Up and Down arrow keys.
 */
export const useCommandHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  /**
   * Pushes a new command into the history buffer.
   */
  const pushHistory = useCallback((command: string) => {
    if (!command.trim()) return;
    setHistory((prev) => {
      // Avoid consecutive duplicate commands in history
      if (prev[prev.length - 1] === command) return prev;
      return [...prev, command];
    });
    // Reset selection pointer
    setHistoryIndex(-1);
  }, []);

  /**
   * Traverses history in the specified direction.
   * Returns the command string corresponding to the new selection, or null if out of bounds.
   */
  const navigateHistory = useCallback((direction: 'up' | 'down'): string | null => {
    if (history.length === 0) return null;

    let newIndex = historyIndex;

    if (direction === 'up') {
      if (historyIndex === -1) {
        // Start navigating from the end of history
        newIndex = history.length - 1;
      } else if (historyIndex > 0) {
        newIndex = historyIndex - 1;
      }
    } else if (direction === 'down') {
      if (historyIndex === -1) {
        return null;
      } else if (historyIndex < history.length - 1) {
        newIndex = historyIndex + 1;
      } else {
        // Reset index to input field
        setHistoryIndex(-1);
        return '';
      }
    }

    setHistoryIndex(newIndex);
    return history[newIndex];
  }, [history, historyIndex]);

  /**
   * Resets the navigation index back to the default (-1).
   */
  const resetIndex = useCallback(() => {
    setHistoryIndex(-1);
  }, []);

  /**
   * Clears the entire history logs.
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  return {
    history,
    pushHistory,
    navigateHistory,
    resetIndex,
    clearHistory
  };
};

export default useCommandHistory;
