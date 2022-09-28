/* global localStorage $ */
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import removeEmptyValues from 'dealer365-utils/removeEmptyValues';
import { parseQry, stringifyQry } from 'dealer365-utils/query';
import { useEffectOnUpdate } from './useEffectOnUpdate';

export function useListLoader(props) {
  const {
    request, // запрос на список
    optionsRequest, // запрос на опции, делается один раз при маунте
    initialLoad = true, // делать запрос при маунте
    useRouter = true, // сохранять изменения в url
    hidden = [], // ключи параметров скрытых из url
    settingsToSave = [], // ключи параметров сохраняемых в localStorage
    passedDefaultParams = {}, // дефолтные параметры для каждого запроса
    passedInitialParams = {}, // параметры для первого запроса
  } = props;

  const defaultParams = {
    filter: {},
    sort: '',
    sort_by: '',
    per_page: '20',
    page: 1,
    ...passedDefaultParams,
  };

  const history = useHistory();
  const location = useLocation();
  const match = useParams();

  const queryObject = useRouter ? parseQry(location.search) : {};

  const getSettings = () => {
    const settings = {};
    settingsToSave.forEach((key) => { settings[key] = localStorage.getItem(key); });
    return settings;
  };

  const setSetting = (key, value) => {
    if (settingsToSave.indexOf(key) >= 0) {
      localStorage.setItem(key, value);
    }
  };

  const initialQueryParamsState = {
    ...defaultParams,
    ...passedInitialParams,
    ...getSettings(),
    ...queryObject,
    page: useRouter ? match.page : ''
  };

  const [params, setParams] = useState(initialQueryParamsState);
  const [lastRequestQuery, setLastRequestQuery] = useState('');
  const [initLoadData, setInitLoadData] = useState(initialLoad);

  const submit = (e, passedParams, info = true) => {
    if (e) e.preventDefault();
    setParams(prevState => ({ ...prevState, page: '', ...passedParams }));
    setInitLoadData(info);
  };

  const refresh = useCallback(() => {
    setInitLoadData(true);
  }, []);

  const setFilter = (e, data = { [e.target.name]: e.target.value }, submitImmediately) => {
    setParams(prevState => ({ ...prevState, filter: { ...prevState.filter, ...data } }));
    if (submitImmediately) submit();
  };

  const setPerPage = (perPage) => {
    setSetting('per_page', perPage);
    submit(null, { per_page: perPage });
  };

  const setPage = (e, page) => {
    submit(e, { page });
  };

  const setSort = (e, sort) => submit(e, { ...sort });

  const resetQueryParams = (e, submitImmediately) => {
    if (e) e.preventDefault();
    setParams(defaultParams);
    if (submitImmediately) setInitLoadData(true);
  };

  const getCurrentParamsQuery = () => stringifyQry(removeEmptyValues(params));

  const getRouterSearch = (passedParams) => {
    const newSearchObj = {};
    Object.entries(passedParams).forEach(([key, value]) => {
      if (value && !hidden.includes(key) && value !== defaultParams[key]) {
        newSearchObj[key] = value;
      }
    });

    return stringifyQry(newSearchObj);
  };

  const loadData = (info) => {
    const { page, ...restParams } = params;

    if (useRouter) {
      const pageUrl = page > 1 ? `/page/${page}` : '';
      const rootUrl = location.pathname.replace(`/page/${match.page}`, '');
      const search = getRouterSearch(restParams);
      const lastUrl = `${location.pathname}${location.search}`;
      const nextUrl = `${rootUrl}${pageUrl}${search ? `?${search}` : ''}`;
      if (lastUrl !== nextUrl) history.push(nextUrl);
    }

    const query = getCurrentParamsQuery();
    setLastRequestQuery(query);
    request({ query, info });
  };

  useLayoutEffect(() => {
    if (initLoadData) {
      loadData(initLoadData);
      setInitLoadData(false);
    }
  }, [initLoadData]);

  useLayoutEffect(() => {
    if (optionsRequest) {
      optionsRequest();
    }
  }, []);

  useEffectOnUpdate(() => {
    if (useRouter) {
      submit(null, { ...defaultParams, ...queryObject, page: match.page });
    }
  }, [location.search, match.page]);

  return {
    setFilter,
    resetQueryParams,
    getCurrentParamsQuery,
    setPerPage,
    setSort,
    setPage,
    submit,
    refresh,
    setQueryParams: setParams,
    perPage: params.per_page,
    ...params,
    sort: { sort: params.sort, sort_by: params.sort_by },
    lastRequestQuery
  };
}
