import { useEffect, useRef } from 'react';

/**
 * A custom hook that provides a way to easily set and clear timeouts with cleanup.
 * @param callback The function to be executed after the timeout.
 * @param delay The delay in milliseconds before the timeout is executed. If null, the timeout is cleared.
 */
export function useTimeout(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout.
  useEffect(() => {
    if (delay === null) {
      return;
    }

    const id = setTimeout(() => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }, delay);

    return () => clearTimeout(id);
  }, [delay]);
}
