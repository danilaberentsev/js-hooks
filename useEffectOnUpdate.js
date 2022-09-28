import { useEffect, useRef } from 'react';

export function useEffectOnUpdate(callback) {
  const mounted = useRef();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      callback();
    }
  }, [callback]);
}
