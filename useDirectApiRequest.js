import { useState } from 'react';
import { renderResponseErrors } from 'dealer365-utils/notifications';

export function useDirectApiRequest(api, onSuccess, onError, noSuccess) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  async function request(e, params) {
    if (e) e.preventDefault();
    if (loading) return;

    setLoading(true);
    const response = await api(params);

    if (response.data && (response.data.success || noSuccess)) {
      setData(response.data);
      if (onSuccess) onSuccess(response.data);
    } else {
      renderResponseErrors(response);
      if (onError) onError(response.data);
    }
    setLoading(false);
  }

  return [request, loading, data, setData];
}
