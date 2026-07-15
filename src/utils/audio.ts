/**
 * ===== Audio Synthesizer =====
 * Generates organic keyboard clicking sound effects using the Web Audio API.
 * This runs natively in the browser without loading large external sound files,
 * ensuring high speed, offline compatibility, and zero asset download errors.
 *
 * Background music is now played from a dedicated MP3 asset.
 */

let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play a synthesized click-clack mechanical keyboard sound.
 * Blends a high-frequency sine wave (switch click) and a low-frequency triangle wave (cap clack).
 */
export const playKeypressSound = (key?: string) => {
  try {
    const ctx = getAudioContext();
    
    // 1. High frequency switch contact "click"
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    
    // 2. Low frequency keycap bottoming out "clack"
    const clackOsc = ctx.createOscillator();
    const clackGain = ctx.createGain();
    clackOsc.connect(clackGain);
    clackGain.connect(ctx.destination);

    let clickFreq = 2300;
    let clackFreq = 340;
    let clickVol = 0.08;
    let clackVol = 0.11;
    let clackDuration = 0.035;

    if (key === 'Enter') {
      clickFreq = 1800;
      clackFreq = 220;
      clickVol = 0.13;
      clackVol = 0.17;
      clackDuration = 0.065;
    } else if (key === ' ') {
      clickFreq = 1950;
      clackFreq = 260;
      clickVol = 0.11;
      clackVol = 0.14;
      clackDuration = 0.05;
    } else if (key === 'Backspace') {
      clickFreq = 2100;
      clackFreq = 300;
      clickVol = 0.10;
      clackVol = 0.12;
      clackDuration = 0.04;
    } else {
      // Randomize pitch slightly to simulate key size variations across the board
      clickFreq = 2200 + Math.random() * 250;
      clackFreq = 320 + Math.random() * 40;
      clackDuration = 0.025 + Math.random() * 0.01;
    }

    // Spring/Switch Tick (Metallic click)
    clickOsc.type = 'sine';
    clickOsc.frequency.setValueAtTime(clickFreq, ctx.currentTime);
    clickOsc.frequency.exponentialRampToValueAtTime(clickFreq / 2.2, ctx.currentTime + 0.005);
    clickGain.gain.setValueAtTime(clickVol, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.005);

    // Keycap bottoming out (Hollow clack)
    clackOsc.type = 'triangle';
    clackOsc.frequency.setValueAtTime(clackFreq, ctx.currentTime);
    clackOsc.frequency.exponentialRampToValueAtTime(clackFreq / 3.2, ctx.currentTime + clackDuration);
    clackGain.gain.setValueAtTime(clackVol, ctx.currentTime);
    clackGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + clackDuration);

    clickOsc.start();
    clackOsc.start();
    clickOsc.stop(ctx.currentTime + 0.005);
    clackOsc.stop(ctx.currentTime + clackDuration);
  } catch (error) {
    console.debug('Failed to play mechanical key click:', error);
  }
};

/**
 * Plays a soft high-pitched ticking sound for teletype writer scrolling in the boot sequence.
 */
export const playTeletypeTick = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const freq = 1450 + Math.random() * 180;
    const duration = 0.015;
    const volume = 0.006;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq / 2.5, ctx.currentTime + duration);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    // Suppress
  }
};
