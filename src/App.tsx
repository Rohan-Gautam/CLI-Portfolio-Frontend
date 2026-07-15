import React, { useState, useEffect, useRef } from 'react';
import type { ProfileResponse, CliConfigResponse } from './types';
import CRTMonitor from './components/CRTMonitor';
import BootSequence from './components/BootSequence';
import Terminal from './components/Terminal';
import { playKeypressSound } from './utils/audio';
import { apiService } from './services/api';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WakeUpScreen } from './components/WakeUpScreen';

/**
 * ===== AppContent =====
 * App container component consuming context settings.
 * Pre-fetches Spring Boot config on load to avoid hardcoding colors even on warning panels.
 */
export const AppContent: React.FC = () => {
  const [poweredOn, setPoweredOn] = useState(false);
  const [booted, setBooted] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [cliConfig, setCliConfig] = useState<CliConfigResponse | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { activeTheme, setThemesList } = useTheme();
  const fetchedRef = useRef(false);

  // Pre-fetch configurations on mount exactly once
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchConfigOnMount = async () => {
      try {
        const configData = await apiService.getCliConfig();
        setCliConfig(configData);
        setThemesList(configData.themes);
      } catch (err) {
        console.error('System config fetch failure:', err);
      }
    };
    fetchConfigOnMount();
  }, [setThemesList]);

  // Activates the system power and triggers HTML5 music playback
  const powerOnSystem = () => {
    if (poweredOn) return;
    setPoweredOn(true);
    if (audioRef.current && musicPlaying) {
      audioRef.current.play().catch((err) => console.log('Autoplay blocked:', err));
    }
  };

  // Listen to keyboard event anywhere to trigger power on
  useEffect(() => {
    if (poweredOn) return;
    const handlePowerOn = () => {
      powerOnSystem();
    };
    window.addEventListener('keydown', handlePowerOn);
    return () => {
      window.removeEventListener('keydown', handlePowerOn);
    };
  }, [poweredOn, musicPlaying]);

  const toggleMusic = (e: React.MouseEvent) => {
    // Prevent focus loss on the page and stop event propagation
    e.preventDefault();
    e.stopPropagation();

    // Play a loud mechanical Enter key click sound for the button click
    playKeypressSound('Enter');

    if (musicPlaying) {
      audioRef.current?.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current?.play().catch((err) => console.log('Audio error:', err));
      setMusicPlaying(true);
    }

    // Notify terminal component to re-focus its input element immediately
    window.dispatchEvent(new Event('focus-terminal-input'));
  };

  /**
   * Callback invoked by BootSequence when API fetches finish
   * and booting screen completes.
   */
  const handleBootComplete = (profileData: ProfileResponse, configData: CliConfigResponse) => {
    setProfile(profileData);
    setCliConfig(configData);
    setBooted(true);
  };

  // 1. Loader screen while API fetches the theme (Cathode warming screen)
  // No theme variables are hardcoded; we await activeTheme population from backend config.
  if (!activeTheme) {
    return <WakeUpScreen />;
  }

  // 2. Main Render once default Catppuccin theme variables are set
  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--terminal-bg)' }}
    >
      {/* Background audio tag looping the MP3 track */}
      <audio ref={audioRef} src="/aria_math.mp3" loop />

      <CRTMonitor>
        {/* Retro Music controller (3x larger styled bezel dial) - Rendered only after power on */}
        {poweredOn && (
          <button
            onClick={toggleMusic}
            onMouseDown={(e) => e.preventDefault()} // Block focus shift during mouse click
            className="absolute top-5 right-6 z-50 font-mono text-[13px] md:text-[15px] bg-black/60 hover:bg-black/90 cursor-pointer px-5 py-2 rounded-lg border-2 border-current opacity-70 hover:opacity-100 transition-all outline-none"
            style={{
              color: 'var(--terminal-fg)',
              borderColor: 'var(--terminal-fg)',
              textShadow: '0 0 2px var(--terminal-fg)',
            }}
          >
            ♪ MUSIC: {musicPlaying ? 'ON' : 'OFF'}
          </button>
        )}

        {!poweredOn ? (
          /* System Startup Warning / Power Button screen */
          <div
            onClick={powerOnSystem}
            className="w-full h-full p-6 flex flex-col items-center justify-center text-center font-mono cursor-pointer select-none"
            style={{
              color: 'var(--terminal-fg)',
              backgroundColor: 'var(--terminal-bg)',
              textShadow: '0 0 3px var(--terminal-fg)',
            }}
          >
            <div className="space-y-4 max-w-[90%] md:max-w-md border border-current p-6 rounded-lg bg-black/45 border-opacity-40">
              <h1 className="text-[13px] md:text-[15px] font-bold tracking-wide animate-pulse">
                === ROHAN-OS VINTAGE WORKSTATION ===
              </h1>

              <div className="text-[10px] md:text-[11px] leading-relaxed text-left space-y-2 border-t border-b border-current py-3.5 my-2 border-opacity-20 opacity-80">
                <p>▶ SYSTEM AUDIO: ONLINE</p>
                <p>▶ BACKGROUND SONG: "ARIA MATH" COMPOSITION</p>
                <p>▶ VOLUME DIALS: UPPER RIGHT CORNER OF CRT SCREEN</p>
              </div>

              <p className="text-[11px] md:text-[12px] font-bold tracking-wider blink mt-4 text-[#ffc600]">
                [ PRESS ANY KEY OR CLICK TO POWER ON ]
              </p>
            </div>
          </div>
        ) : !booted ? (
          <BootSequence prefetchedCliConfig={cliConfig} onBootComplete={handleBootComplete} />
        ) : (
          profile &&
          cliConfig && (
            <Terminal
              profile={profile}
              cliConfig={cliConfig}
              onThemeChange={() => { }} // Dummy compatibility callback
            />
          )
        )}
      </CRTMonitor>
    </div>
  );
};

/**
 * Main application wrapper wrapping downstream hooks in ThemeProvider context.
 */
export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
