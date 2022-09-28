import { useState } from 'react';

export function useSort() {
  const [sort, setSort] = useState({});

  const onChange = ({ name, order }) => {
    const contraryOrder = sort.order === 'up' ? 'down' : 'up';

    setSort({
      name,
      order: order || name === sort.name ? contraryOrder : 'down'
    });
  };

  return {
    ...sort,
    onChange
  };
}
