/* global window */
import { useState } from 'react';
import { renderResponseErrors } from 'dealer365-utils/notifications';

export const useResponseRedirect = ({ api, params, key = 'url', onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const redirect = async (e, data) => {
    if (e) e.preventDefault();
    if (loading) return;

    setLoading(true);
    const response = await api(params || data);

    if (response.data && response.data.success && response.data[key]) {
      const newWindow = window.open(response.data[key], '_blank', 'noopener, noreferrer');
      if (newWindow) newWindow.opener = null;
      if (onSuccess) onSuccess(response.data);
    } else {
      renderResponseErrors(response);
    }
    setLoading(false);
  };

  return [redirect, loading];
};
