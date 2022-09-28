import { useCallback, useRef } from 'react';

export function useThrottle(callback, delay) {
  const isThrottled = useRef(null);

  return useCallback((...args) => {
    if (isThrottled.current) return;
    callback(args);
    isThrottled.current = true;

    setTimeout(() => { isThrottled.current = false; }, delay);
  }, [callback, delay]);
}
