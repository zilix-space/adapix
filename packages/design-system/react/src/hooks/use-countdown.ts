import React, { useState, useEffect } from 'react';

/**
 * A custom hook that provides a countdown timer.
 * @param seconds The initial number of seconds for the countdown.
 * @param onEnd Optional callback function to be executed when the countdown ends.
 * @returns An object containing the remaining days, hours, minutes, and seconds.
 */
export function useCountdown(
  seconds: number,
  onEnd?: () => void
): {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  reset: () => void
} {
  const [countdown, setCountdown] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
  });

  const calculateTimeLeft = (totalSeconds: number) => ({
    seconds: totalSeconds % 60,
    minutes: Math.floor(totalSeconds / 60) % 60,
    hours: Math.floor(totalSeconds / 3600) % 24,
    days: Math.floor(totalSeconds / 86400),
  });

  useEffect(() => {
    setCountdown(calculateTimeLeft(seconds));

    const interval = setInterval(() => {
      setCountdown((currentCountdown) => {
        const totalSeconds =
          currentCountdown.days * 86400 +
          currentCountdown.hours * 3600 +
          currentCountdown.minutes * 60 +
          currentCountdown.seconds -
          1;

        if (totalSeconds < 0) {
          clearInterval(interval);
          if (onEnd) onEnd();
          return currentCountdown;
        }

        return calculateTimeLeft(totalSeconds);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onEnd]);

  return {
    ...countdown,
    reset: () => setCountdown(calculateTimeLeft(seconds)),
  };
}
