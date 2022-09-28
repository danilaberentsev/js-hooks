import { useState } from 'react';

export function useModal({ stopPropagation } = {}) {
  const [show, setShow] = useState(false);

  function open(e, data) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && stopPropagation && e.stopPropagation) e.stopPropagation();

    let result = true;
    if (data) result = data;
    else if (e && e.currentTarget.dataset.id) result = e.currentTarget.dataset.id;
    else if (e && !e.target) result = e;

    setShow(result);
  }

  function close(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (e && stopPropagation && e.stopPropagation) e.stopPropagation();

    setShow(false);
  }

  return [show, open, close];
}
