/* global window */
/* eslint no-console: 0 */
import { useState } from 'react';
import { getJson, saveJson } from 'dealer365-utils';

export function useLocalStorage(key, initialValue) {
  const [data, setData] = useState(getJson(key) || initialValue);

  const onChange = (value) => {
    saveJson(key, value);
    setData(value);
  };

  return [data, onChange];
}
