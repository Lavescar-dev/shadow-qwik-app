import type { ControlsState, Product } from '../types';

export const getCategories = (products: readonly Product[]) => [...new Set(products.map((product) => product.tag))].sort();

export const filterProducts = (products: readonly Product[], controls: ControlsState) => {
  const { searchQuery, category, sort } = controls;
  let result = [...products];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter((product) => (
      product.name.toLowerCase().includes(query)
      || product.desc.toLowerCase().includes(query)
      || product.tag.toLowerCase().includes(query)
    ));
  }

  if (category !== 'ALL') {
    result = result.filter((product) => product.tag === category);
  }

  if (sort === 'PRICE_ASC') result.sort((a, b) => a.price - b.price);
  if (sort === 'PRICE_DESC') result.sort((a, b) => b.price - a.price);

  return result;
};

export const paginateProducts = (products: readonly Product[], currentPage: number, itemsPerPage: number) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return products.slice(startIndex, startIndex + itemsPerPage);
};
