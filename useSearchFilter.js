import { useState } from 'react';

export function useSearchFilter({ data, key = 'name' }) {
  const [search, setSearch] = useState('');

  const filteredData = search ? data.filter((item) => {
    const valueFormatted = item[key].trim().toLowerCase().replaceAll(' ', '');
    const searchFormatted = search.toLowerCase().replaceAll(' ', '');
    return valueFormatted.indexOf(searchFormatted) >= 0;
  }) : data;

  const clear = (e) => {
    if (e) e.preventDefault();
    setSearch('');
  };

  return [search, setSearch, filteredData, clear];
}
