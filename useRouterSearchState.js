import { useHistory, useLocation } from 'react-router';
import { merge } from 'lodash';
import { parseQry, stringifyQry, removeEmptyValues } from 'dealer365-utils';

export function useRouterSearchState({ pathname: passedPathname } = {}) {
  const history = useHistory();
  const { search, pathname } = useLocation();
  const searchObject = parseQry(search);

  const setSearch = (data) => {
    const newSearch = stringifyQry(removeEmptyValues(merge(searchObject, data)));
    history.push(`${passedPathname || pathname}?${newSearch}`);
  };

  return { search, setSearch, searchObject };
}
