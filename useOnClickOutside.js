/* global document */
import { useCallback, useEffect, useRef } from 'react';

export function useOnClickOutside(callback) {
  const ref = useRef();

  const handleClickOutside = useCallback((e) => {
    if (ref.current && !ref.current.contains(e.target)) callback();
  }, [callback]);

  const handleEscapePress = useCallback((e) => {
    if (e.keyCode === 27) callback();
  }, [callback]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleEscapePress, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscapePress, true);
    };
  }, [ref, handleClickOutside, handleEscapePress]);

  return ref;
}
