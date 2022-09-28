import { useEffect } from 'react';

export function useSelect({ disabled, options, idKey, name, onChange, showTitle, value, noDefault }) {
  const selectDisabled = disabled || !Array.isArray(options) || !options.length;
  const defaultOption = options[0];
  const isObj = typeof defaultOption === 'object';
  const defaultValue = isObj ? defaultOption[idKey] : defaultOption;

  const selectItem = (e, id = e.target.value) => {
    const item = options.find(opt => `${id}` === (isObj ? `${opt[idKey]}` : `${opt}`));
    const result = name ? { [name]: id } : id;
    onChange(result, item, e);
  };

  function setDefault() {
    if (!options.length) return;

    const isOnlyOption = options.length === 1;
    const noTitleNoValue = !showTitle && !value;

    if (((isOnlyOption && !noDefault) || noTitleNoValue) && value !== defaultValue) {
      selectItem(false, defaultValue);
    }
  }

  useEffect(() => {
    setDefault();
  }, [options]);

  return {
    isObj,
    selectItem,
    selectDisabled,
  };
}
