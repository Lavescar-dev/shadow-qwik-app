import { component$, useContext } from '@builder.io/qwik';
import { AppContext } from '../context/app-context';
import { setCategory, setSearchQuery, setSort } from '../lib/actions';
import type { SortKey } from '../types';

export const CatalogControls = component$(() => {
  const { app, categories } = useContext(AppContext);
  return (
    <div class="mb-8 p-4 border border-term_dim bg-term_bg flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex-grow w-full md:w-auto relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">grep -i</span>
        <input type="text" value={app.controls.searchQuery} onInput$={(_, target) => setSearchQuery(app, target.value)} placeholder="'query' ./inventory..." class="w-full bg-black border border-term_dim text-term_fg pl-24 pr-4 py-2 focus:border-term_accent focus:outline-none font-mono" />
      </div>
      <div class="flex gap-4 w-full md:w-auto flex-col sm:flex-row">
        <select value={app.controls.category} onChange$={(_, target) => setCategory(app, target.value)} class="bg-black border border-term_dim text-term_fg px-4 py-2 focus:border-term_accent focus:outline-none font-mono flex-grow">
          <option value="ALL">Kategori: Tümü</option>
          {categories.map((category) => <option key={category} value={category}>{`Kategori: ${category}`}</option>)}
        </select>
        <select value={app.controls.sort} onChange$={(_, target) => setSort(app, target.value as SortKey)} class="bg-black border border-term_dim text-term_fg px-4 py-2 focus:border-term_accent focus:outline-none font-mono flex-grow">
          <option value="DEFAULT">Sırala: Varsayılan</option>
          <option value="PRICE_ASC">Fiyat: Artan</option>
          <option value="PRICE_DESC">Fiyat: Azalan</option>
        </select>
      </div>
    </div>
  );
});
