import { useRef, useCallback } from 'react';

export function useRequestInterval({ ms = 15000, request }) {
  const timeout = useRef(null);

  const start = useCallback(() => {
    request();
    timeout.current = setTimeout(start, ms);
  }, [timeout.current, request]);

  const stop = useCallback(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }, [timeout.current]);

  return {
    start,
    stop
  };
}
