import { useLocation } from 'react-router-dom';
import { useParams, useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import { flatTree, getParentIDS } from 'dealer365-utils/collection';
import { parseQry } from 'dealer365-utils';
import { createSelector } from 'reselect';

export const catalogSectionsSelector = state => state.catalog.sections;

export const flatSectionSelector = createSelector(
  catalogSectionsSelector,
  sections => flatTree(sections.data, 'children', 'id'),
);

export function useBreadcrumb({ idKey = 'id', singular, plural }) {
  const { search } = useLocation();
  const { filter = {}, ...restSearch } = parseQry(search);
  const { section_id: sectionId, ...restFilter } = filter;
  const { page, ...rest } = useParams();
  const flatSections = useSelector(flatSectionSelector);
  const id = rest[idKey];

  const { path, url } = useRouteMatch();

  const replaceRegExp = new RegExp(`/edit/:${idKey}|/view/:${idKey}|/page/:page|/:${idKey}`, 'g');
  const cleanListLink = path.replace(replaceRegExp, '');
  const listFilterLink = `${cleanListLink}${search}`;
  const listLink = `${cleanListLink}${page ? `/page/${page}` : ''}${search}`;
  const detailLink = `${url}${search}`;
  const addLink = `${cleanListLink}/edit/add${page ? `/page/${page}` : ''}${search}`;
  const getDetailLink = entityId => `${cleanListLink}/view/${entityId}${page ? `/page/${page}` : ''}${search}`;
  const getEditLink = entityId => `${cleanListLink}/edit/${entityId}${page ? `/page/${page}` : ''}${search}`;

  const listTitle = `Список ${plural}`;
  const viewEditTitle = path.indexOf('edit') > 0 ? `Редактирование ${singular} ${id}` : `Просмотр ${singular} ${id}`;
  const detailTitle = id === 'add' ? `Добавление ${singular}` : viewEditTitle;
  const breadcrumb = [{ link: cleanListLink, title: listTitle }];


  if (sectionId && flatSections[sectionId]) {
    const parentIds = getParentIDS(flatSections, sectionId, 'parent_id').reverse();
    parentIds.forEach((pid) => {
      breadcrumb.push({ link: `${cleanListLink}?filter[section_id]=${pid}`, title: flatSections[pid].name });
    });
  }

  if (!isEmpty(restSearch) || !isEmpty(restFilter)) {
    breadcrumb.push({ link: listFilterLink, title: 'Фильтр' });
  }

  if (page > 1) {
    breadcrumb.push({ link: listLink, title: `Страница ${page}` });
  }

  if (id) {
    breadcrumb.push({ link: detailLink, title: detailTitle });
  }

  return {
    listLink,
    detailLink,
    listFilterLink,
    cleanListLink,
    addLink,
    listTitle,
    detailTitle,
    getDetailLink,
    getEditLink,
    breadcrumb
  };
}
