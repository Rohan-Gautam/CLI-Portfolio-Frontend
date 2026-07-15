import { useState, useCallback, useRef } from 'react';
import type {
  ProfileResponse,
  CliConfigResponse,
  TerminalLine,
  ThemeInfo,
} from '../types';
import { apiService } from '../services/api';
import { useCommandHistory } from './useCommandHistory';
import { parseCommand, resolveAutocomplete } from '../utils/commandParser';
import { useTheme } from '../context/ThemeContext';
import {
  formatHelp,
  formatAbout,
  formatSkills,
  formatProjects,
  formatExperience,
  formatEducation,
  formatSocials,
  formatNeofetch,
} from '../utils/formatter';

// Helper to generate unique line IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

interface UseTerminalProps {
  profile: ProfileResponse;
  cliConfig: CliConfigResponse;
  onThemeChange: (theme: ThemeInfo) => void;
}

export const useTerminal = ({
  profile,
  cliConfig,
  onThemeChange,
}: UseTerminalProps) => {
  const { activeTheme, setTheme } = useTheme();
  const [lines, setLines] = useState<TerminalLine[]>(() => {
    const welcomeQuote = cliConfig.quotes && cliConfig.quotes.length > 0
      ? cliConfig.quotes[Math.floor(Math.random() * cliConfig.quotes.length)]
      : '';
    
    return [
      {
        id: 'ascii-art',
        type: 'output',
        text: cliConfig.asciiArt || '',
      },
      {
        id: 'welcome-msg',
        type: 'output',
        text: `Welcome.\n${welcomeQuote ? `"${welcomeQuote}"\n` : ''}\nType "help" to begin.\n`,
      },
    ];
  });
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    history,
    pushHistory,
    navigateHistory,
    resetIndex,
    clearHistory,
  } = useCommandHistory();

  // Reference for available command strings
  const commandList = cliConfig.commands.map((c) => c.command);

  /**
   * Appends a new line of text to the terminal output.
   */
  const appendLine = useCallback((type: TerminalLine['type'], text: string) => {
    setLines((prev) => [
      ...prev,
      {
        id: generateId(),
        type,
        text,
      },
    ]);
  }, []);

  /**
   * Autocompletes the input command on TAB keypress.
   */
  const handleAutocomplete = useCallback(() => {
    if (!input.trim()) return;
    const completed = resolveAutocomplete(input, commandList);
    if (completed) {
      setInput(completed);
    }
  }, [input, commandList]);

  /**
   * Traverse the history log using Arrow keys.
   */
  const handleHistoryNavigation = useCallback((direction: 'up' | 'down') => {
    const command = navigateHistory(direction);
    if (command !== null) {
      setInput(command);
    }
  }, [navigateHistory]);

  /**
   * Focuses the terminal input field.
   */
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  /**
   * Primary command executor. Matches the user input command and calls services/formatters.
   */
  const executeCommand = useCallback(async (rawInput: string) => {
    const cleanedInput = rawInput.trim();
    if (!cleanedInput) return;

    // 1. Add input command to the screen logs
    appendLine('input', cleanedInput);
    
    // 2. Save in command history
    pushHistory(cleanedInput);
    resetIndex();
    setInput('');

    const { command, args } = parseCommand(cleanedInput);

    // ===== Command Router =====
    switch (command) {
      case 'clear':
        setLines([]);
        break;

      case 'help':
        appendLine('output', formatHelp(cliConfig.commands));
        break;

      case 'whoami':
        appendLine('output', formatNeofetch(cliConfig.asciiArt, profile));
        break;

      case 'about':
        appendLine('output', formatAbout(profile));
        break;

      case 'skills':
        appendLine('system', 'Connecting database... Fetching skills profile...');
        try {
          // Cached in apiService
          const data = await apiService.getSkills();
          appendLine('output', formatSkills(data));
        } catch (error) {
          appendLine('error', 'Error: Failed to fetch skills from backend server.');
        }
        break;

      case 'projects':
        appendLine('system', 'Establishing secure link... Downloading project records...');
        try {
          // Cached in apiService
          const data = await apiService.getProjects();
          appendLine('output', formatProjects(data));
        } catch (error) {
          appendLine('error', 'Error: Failed to fetch projects from backend server.');
        }
        break;

      case 'experience':
        appendLine('system', 'Initiating telemetry... Accessing work history data...');
        try {
          // Cached in apiService
          const data = await apiService.getExperience();
          appendLine('output', formatExperience(data));
        } catch (error) {
          appendLine('error', 'Error: Failed to fetch work experiences.');
        }
        break;

      case 'education':
        appendLine('output', formatEducation(profile));
        break;

      case 'socials':
        appendLine('output', formatSocials(profile));
        break;

      case 'resume':
        if (profile.resumeUrl) {
          appendLine('system', 'Opening resume document in new tab...');
          window.open(profile.resumeUrl, '_blank');
        } else {
          appendLine('error', 'Error: Resume URL is not configured on this profile.');
        }
        break;

      case 'theme':
        if (args.length === 0) {
          appendLine('theme-picker', '');
        } else {
          const success = setTheme(args[0]);
          if (success) {
            appendLine('system', `System theme updated to [${args[0].toUpperCase()}].`);
          } else {
            appendLine('error', `Unknown theme.`);
            appendLine('theme-picker', '');
          }
        }
        break;

      case 'history':
        // Display history list (all elements except the current command)
        if (history.length === 0) {
          appendLine('output', 'Command history is empty.');
        } else {
          appendLine('output', history.map((h, i) => `  ${i + 1}  ${h}`).join('\n'));
        }
        break;

      default:
        appendLine(
          'error',
          `bash: command not found: ${command}. Type "help" to view available terminal services.`
        );
        break;
    }
  }, [profile, cliConfig, pushHistory, resetIndex, appendLine, history, onThemeChange, setTheme, activeTheme]);

  return {
    lines,
    input,
    setInput,
    inputRef,
    executeCommand,
    handleAutocomplete,
    handleHistoryNavigation,
    focusInput,
    clearHistory
  };
};

export default useTerminal;
