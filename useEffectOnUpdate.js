import React, { useEffect, useRef } from 'react';

export const useEffectOnUpdate = (callback, deps) => {
  const mounted = useRef();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      callback();
    }
  }, deps);
};
