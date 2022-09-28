import { useEffect } from 'react';
import { useOnClickOutside, useDebounce } from '../../index';
import { useAutocompleteState } from './useAutocompleteState';

export function useAutocomplete({
  labelKey = 'name',
  suggestionsKey = 'data',
  selected: passedSelected,
  loadOptions,
  resetOnBlur = true,
  onSelect
}) {
  const { state, dispatch, getSelected } = useAutocompleteState({ passedSelected, labelKey, resetOnBlur });

  const debouncedRequest = useDebounce(async (value) => {
    try {
      dispatch({ type: 'LOADING' });
      const response = await loadOptions(value);
      const suggestions = response[suggestionsKey];
      dispatch({ type: 'LOADED', suggestions, value });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      dispatch({ type: 'LOAD_ERROR' });
    }
  }, 150);

  const handleInputChange = (e, value = e.target.value) => {
    dispatch({ type: 'CHANGE', value });
    if (!state.cache[value.trim()]) debouncedRequest(value);
  };

  const handleFocus = () => {
    handleInputChange(null, state.value);
  };

  const handleBlur = () => {
    dispatch({ type: 'BLUR' });
  };

  const handleSelect = (e, item) => {
    if (e) e.preventDefault();
    dispatch({ type: 'SELECT', item });
    if (onSelect) onSelect(item);
  };

  useEffect(() => {
    if (getSelected(passedSelected) !== state.selected) {
      dispatch({ type: 'SELECT', item: passedSelected });
    }
  }, [passedSelected]);

  const ref = useOnClickOutside(() => {
    if (state.focus) handleBlur();
  });

  return {
    handleSelect,
    handleInputChange,
    handleFocus,
    handleBlur,
    getSelected,
    ref,
    state,
  };
}

