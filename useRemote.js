import { useState } from 'react';
import { renderResponseErrors } from 'dealer365-utils';

export function useRemote({ api, successKey = 'success' }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const request = async (...params) => {
    setLoading(true);
    const response = await api(...params);

    if (response.data && response.data[successKey]) {
      setData(response.data);
    } else {
      renderResponseErrors(response);
    }

    setLoading(false);
    return response;
  };

  return {
    request,
    loading,
    data,
    setData,
  };
}
