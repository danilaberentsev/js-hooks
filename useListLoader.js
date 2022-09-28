import { useEffect, useReducer, useRef, useCallback } from 'react';

const modes = {
  request: 'request',
  requestMore: 'requestMore',
  refresh: 'refresh',
  rewrite: 'rewrite',
};

// request callback should be memoized
export function useListLoader({ total, extParams, request, initialLoad = true }) {
  const defaultState = {
    page: 1,
    perPage: 20,
    sort: '',
    sort_by: '',
    mode: modes.request,
    ...extParams
  };

  const paramsReducer = (state, { mode, data }) => {
    switch (mode) {
      case modes.requestMore: return { ...state, page: state.page + 1, mode };
      case modes.refresh: return { ...state, page: 1, mode };
      case modes.request: return { ...state, ...data, mode };
      case modes.rewrite: return { ...defaultState, ...data, mode: 'request' };
      default: return state;
    }
  };

  const [params, dispatch] = useReducer(paramsReducer, defaultState);
  const shouldLoad = useRef(initialLoad);
  const canLoadMore = total > params.page * params.perPage;

  useEffect(() => {
    if (shouldLoad.current) {
      const { mode, page, perPage, sort_by: sortBy, sort, ...filter } = params;
      request(mode, removeEmptyValues({ page, per_page: perPage, sort, sort_by: sortBy, filter }));
    } else {
      shouldLoad.current = true;
    }
  }, [request, params]);

  return {
    params,
    refresh: useCallback(() => dispatch({ mode: modes.refresh }), []),
    loadMore: useCallback(() => { if (canLoadMore) dispatch({ mode: modes.requestMore }); }, [canLoadMore]),
    updateParams: useCallback((data) => dispatch({ mode: modes.request, data }), []),
    updateWithReset: useCallback((data) => dispatch({ mode: modes.request, data: { ...data, page: 1 } }), []),
    filterRewrite: useCallback((data) => dispatch({ mode: modes.rewrite, data }), [])
  };
}


function removeEmptyValues(obj) {
  const newObj = { ...obj };

  Object.keys(newObj).forEach((key) => {
    if (!newObj[key]) {
      delete newObj[key];
    } else if (typeof newObj[key] === 'object' && !Array.isArray(newObj[key])) {
      newObj[key] = removeEmptyValues(newObj[key]);
    }
  });

  return newObj;
}
