import { useCallback, useRef } from 'react';

// prefer to use real ids in checkbox lists
const generateMostlyUniqueId = () => performance.now().toString(36) + Math.random().toString(36).slice(2);

// possible values Y/N, 1/0, true/false
export function useCheckbox({ id, valueType, onChange, name, value }) {
  const idRef = useRef(id || generateMostlyUniqueId());

  const getValue = useCallback((checked) => {
    switch (valueType) {
      case 'string': return checked ? 'Y' : 'N';
      case 'number': return checked ? 1 : 0;
      default: return checked || false;
    }
  }, [valueType]);

  const onCheck = useCallback((e) => {
    onChange(name ? { [name]: getValue(e.target.checked) } : getValue(e.target.checked), e);
  }, [name, getValue, onChange]);

  const getChecked = useCallback((val) => {
    switch (valueType) {
      case 'string': return val === 'Y';
      case 'number': return val === 1;
      default: return val === true;
    }
  }, [valueType]);

  return {
    idRef,
    onCheck,
    checked: getChecked(value),
  };
}
