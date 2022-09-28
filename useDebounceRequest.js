import { useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';

export function useDebounceRequest(apiRequest, delay = 500) {
  const controller = useRef(null);

  const abort = useCallback(() => {
    if (controller.current) controller.current.abort('Request aborted by user');
  }, []);

  const apiRequestWithAbort = useCallback((params) => {
    abort();
    controller.current = new AbortController();
    apiRequest({ ...params, signal: controller.current.signal });
  }, [abort, apiRequest]);

  const debounced = useDebounce(apiRequestWithAbort, delay);

  return [debounced, abort];
}
