import React, { useEffect, useState, useRef } from 'react';
import { apiService } from '../services/api';
import type { ProfileResponse, CliConfigResponse } from '../types';
import Cursor from './Cursor';
import { playTeletypeTick } from '../utils/audio';

interface BootSequenceProps {
  prefetchedCliConfig: CliConfigResponse | null;
  onBootComplete: (profile: ProfileResponse, cliConfig: CliConfigResponse) => void;
}

/**
 * ===== BootSequence Component =====
 * Plays a retro boot sequence when the page first loads.
 * Performs background GET /api/profile and GET /api/cli-config API calls
 * and displays loading logs character-by-character.
 * Once files are successfully fetched and the sequence concludes, it enters the terminal dashboard.
 */
export const BootSequence: React.FC<BootSequenceProps> = ({ prefetchedCliConfig, onBootComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [isFetched, setIsFetched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileRef = useRef<ProfileResponse | null>(null);
  const cliConfigRef = useRef<CliConfigResponse | null>(null);

  const steps = [
    { text: 'Booting RohanOS...', key: 'boot' },
    { text: 'Loading kernel modules...', key: 'kernel' },
    { text: 'Connecting to REST backend services...', key: 'connect' },
    { text: 'Fetching profile identity schemas...', key: 'profile' },
    { text: 'Caching assets & setting configurations...', key: 'config' },
    { text: 'Loading terminal shell display...', key: 'terminal' },
    { text: 'Ready.', key: 'ready' },
  ];

  // 1. Initiate API requests on mount
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const profileData = await apiService.getProfile();
        const configData = prefetchedCliConfig || await apiService.getCliConfig();

        profileRef.current = profileData;
        cliConfigRef.current = configData;
        setIsFetched(true);
      } catch (err: any) {
        console.error('Boot system failure:', err);
        setError('FATAL SYSTEM EXCEPTION: API_HOST_UNREACHABLE (500). System halted.');
      }
    };
    bootstrap();
  }, [prefetchedCliConfig]);

  // 2. Typewriter animation loops
  useEffect(() => {
    if (error) return;

    if (stepIndex >= steps.length) {
      // Once logs finish, if the network API responses are available, load the workspace terminal
      if (isFetched && profileRef.current && cliConfigRef.current) {
        const timeout = setTimeout(() => {
          onBootComplete(profileRef.current!, cliConfigRef.current!);
        }, 500);
        return () => clearTimeout(timeout);
      }
      return;
    }

    const currentStep = steps[stepIndex];

    // Pause boot progression if API requests are pending at crucial steps
    if (
      (currentStep.key === 'config' ||
        currentStep.key === 'terminal' ||
        currentStep.key === 'ready') &&
      !isFetched
    ) {
      return;
    }

    let charIndex = 0;
    setCurrentLine('');

    const typingTimer = setInterval(() => {
      setCurrentLine((prev) => prev + currentStep.text.charAt(charIndex));
      playTeletypeTick();
      charIndex++;

      if (charIndex >= currentStep.text.length) {
        clearInterval(typingTimer);

        // Move to the next step after a short delay
        const stepDelay = setTimeout(() => {
          setLines((prev) => [...prev, currentStep.text]);
          setCurrentLine('');
          setStepIndex((prev) => prev + 1);
        }, 120);

        return () => clearTimeout(stepDelay);
      }
    }, 18);

    return () => {
      clearInterval(typingTimer);
    };
  }, [stepIndex, isFetched, error]);

  return (
    <div className="font-mono text-[12px] md:text-[13px] leading-relaxed p-5 h-full flex flex-col justify-start select-none overflow-y-auto">
      <div className="flex-1">
        {lines.map((line, index) => (
          <div key={index} style={{ color: 'var(--terminal-fg)', opacity: 0.8 }}>
            {line}
          </div>
        ))}

        {error ? (
          <div className="font-bold mt-3 animate-pulse" style={{ color: 'var(--terminal-accent)' }}>
            {error}
            <br />
            Please configure VITE_API_BASE_URL in your .env configuration.
          </div>
        ) : (
          currentLine && (
            <div style={{ color: 'var(--terminal-fg)' }}>
              {currentLine}
              <Cursor />
            </div>
          )
        )}
      </div>

      <div className="text-[10px] opacity-40 text-right mt-auto">
        RohanOS Kernel v1.0.4-x86_64
      </div>
    </div>
  );
};

export default BootSequence;
