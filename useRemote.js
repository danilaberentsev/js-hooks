import { useState } from 'react';

export function useRemote({ api, successKey = 'success' }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  const request = async (...params) => {
    setLoading(true);
    setError(null);
    const response = await api(...params);

    if (response.data && response.data[successKey]) {
      setData(response.data);
    } else {
      setError(response.error);
    }

    setLoading(false);
    return response;
  };

  return {
    request,
    loading,
    data,
    setData,
    error,
    setError,
  };
}
