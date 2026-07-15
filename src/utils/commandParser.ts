/**
 * ===== Command Parser =====
 * Parses command input strings and provides tab completion logic.
 */

export interface ParsedCommand {
  command: string;
  args: string[];
}

/**
 * Tokenizes the raw command input string into the base command and argument array.
 */
export const parseCommand = (input: string): ParsedCommand => {
  const trimmed = input.trim();
  if (!trimmed) {
    return { command: '', args: [] };
  }

  // Split by whitespace
  const tokens = trimmed.split(/\s+/);
  return {
    command: tokens[0].toLowerCase(),
    args: tokens.slice(1),
  };
};

/**
 * Resolves autocompletion for a partial command input.
 * Returns the matched command if a single unique match is found.
 */
export const resolveAutocomplete = (
  input: string,
  availableCommands: string[]
): string | null => {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  const matches = availableCommands.filter((cmd) => cmd.startsWith(trimmed));
  // If there is exactly one unique prefix match, autocomplete it
  if (matches.length === 1) {
    return matches[0];
  }
  return null;
};
