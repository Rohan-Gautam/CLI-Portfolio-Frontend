import { useState, useEffect } from 'react';

/**
 * A custom hook that simulates a retro typewriter effect by revealing characters one by one.
 *
 * @param text The target string to type out.
 * @param speed Typing speed in milliseconds per character.
 * @param startTrigger Controls when to initiate typing.
 * @param onComplete Callback invoked when the typing finishes.
 */
export const useTyping = (
  text: string,
  speed: number = 10,
  startTrigger: boolean = true,
  onComplete?: () => void
) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!startTrigger) {
      setDisplayText('');
      setIsComplete(false);
      return;
    }

    setDisplayText('');
    setIsComplete(false);

    if (!text) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      // Use standard charAt to safely append characters
      setDisplayText((prev) => prev + text.charAt(currentIndex));
      currentIndex++;

      if (currentIndex >= text.length) {
        clearInterval(intervalId);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, speed, startTrigger]);

  return { displayText, isComplete };
};
export default useTyping;
