import React, { useCallback, useRef } from 'react';

export function useThrottle(callback, delay) {
  const isThrottled = useRef(null);

  return useCallback((...args) => {
    if (isThrottled.current) {
      return;
    }
    callback(args);
    isThrottled.current = true;
    // eslint-disable-next-line no-return-assign
    setTimeout(() => isThrottled.current = false, delay);
  }, [callback, delay]);
}
