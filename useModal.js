import { useState, useCallback } from 'react';

export function useModal({ initialState = false } = {}) {
  const [isShown, setIsShown] = useState(initialState);

  return {
    isShown,
    show: useCallback((data) => setIsShown(data || true), []),
    hide: useCallback(() => setIsShown(false), []),
    toggle: useCallback(() => setIsShown((prev) => !prev), [])
  };
}
