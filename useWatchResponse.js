import { renderResponseErrors } from 'dealer365-utils/notifications';
import { useEffectOnUpdate } from './useEffectOnUpdate';

export const useWatchResponse = (...states) => {
  states.forEach(({ loading, data, responseStatus }) => {
    useEffectOnUpdate(() => {
      if (!loading && !data.success) {
        renderResponseErrors({ data, status: responseStatus });
      }
    }, [loading]);
  });
};
