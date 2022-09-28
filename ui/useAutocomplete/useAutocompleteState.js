import { useCallback, useReducer } from 'react';

export function useAutocompleteState({ passedSelected, labelKey, resetOnBlur = true }) {
  const getSelected = useCallback((item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object') return item[labelKey];
    return '';
  }, [labelKey]);

  const reducer = useCallback((state, { type, item, value, suggestions }) => {
    const mergeState = newState => ({ ...state, ...newState });

    switch (type) {
      case 'CHANGE':
        return mergeState({
          focus: true,
          value,
          suggestions: state.cache[value.trim()] || [],
        });
      case 'SELECT':
        return mergeState({
          focus: false,
          value: getSelected(item),
          selected: getSelected(item),
        });
      case 'BLUR': {
        const reseted = state.selected !== getSelected(passedSelected) ? getSelected(passedSelected) : state.selected;
        const selected = resetOnBlur ? reseted : state.selected;
        const newValue = resetOnBlur ? reseted : state.value;
        return mergeState({ selected, value: newValue, focus: false });
      }
      case 'LOADING':
        return mergeState({ loading: true });
      case 'LOAD_ERROR':
        return mergeState({ loading: false, suggestions: [] });
      case 'LOADED':
        return mergeState({
          cache: { ...state.cache, [value.trim()]: suggestions },
          loading: false,
          suggestions,
        });
      default: return state;
    }
  }, [getSelected, passedSelected]);

  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    focus: false,
    value: getSelected(passedSelected),
    selected: getSelected(passedSelected),
    cache: {},
    suggestions: [],
  });

  return { state, dispatch, getSelected };
}
