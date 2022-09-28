import { useEffect, useRef, useState, useCallback } from 'react';

export function useTimer(sec, initImmediately) {
  const [remaining, setRemaining] = useState(sec);
  const timerRef = useRef(null);

  const initTimer = useCallback((passedSec) => {
    setRemaining(passedSec || sec);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining(prev => prev - 1);
    }, 1000);
  }, [sec]);

  useEffect(() => {
    if (initImmediately) initTimer();

    return () => clearInterval(timerRef.current);
  }, [initImmediately, initTimer]);

  useEffect(() => {
    if (remaining < 1) {
      clearInterval(timerRef.current);
    }
  }, [remaining]);

  const hours = parseInt(remaining / 3600, 10);
  const minutes = parseInt((remaining - (hours * 3600)) / 60, 10);
  const seconds = remaining - ((hours * 3600) + (minutes * 60));
  const hoursString = `${hours ? `${hours}:` : ''}`;
  const minutesString = `${minutes < 10 ? `0${minutes}` : minutes}`;
  const secondsString = `${seconds < 10 ? `0${seconds}` : seconds}`;

  return {
    remainingString: `${hoursString}${minutesString}:${secondsString}`,
    remaining,
    initTimer
  };
}
