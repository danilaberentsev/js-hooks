/* global window */
import { useRef } from 'react';
import { isEmpty } from 'lodash';
import { useEffectOnUpdate } from './useEffectOnUpdate';

export function useBrowserPopup({ data }) {
  const myWindow = useRef(null);

  useEffectOnUpdate(() => {
    if (!isEmpty(data) && myWindow.current) {
      if (data.url && data.success) {
        myWindow.current.document.location.href = data.url;
        myWindow.current.focus();
      } else {
        myWindow.current.close();
      }
      myWindow.current = null;
    }
  }, [data]);

  const initWindowOpen = () => {
    myWindow.current = window.open('', '');
  };

  return [initWindowOpen];
}
