import { component$, useComputed$, useContext, useTask$ } from '@builder.io/qwik';
import { AppContext } from '../context/app-context';
import { filterProducts, paginateProducts } from '../lib/catalog';
import { CatalogControls } from './catalog-controls';
import { Pagination } from './pagination';
import { ProductCard } from './product-card';

export const CatalogView = component$(() => {
  const { app, products } = useContext(AppContext);
  const filteredProducts = useComputed$(() => filterProducts(products, app.controls));
  const totalPages = useComputed$(() => Math.max(1, Math.ceil(filteredProducts.value.length / app.controls.itemsPerPage)));

  useTask$(({ track }) => {
    const currentPage = track(() => app.controls.currentPage);
    const maxPage = track(() => totalPages.value);
    if (currentPage > maxPage) app.controls.currentPage = maxPage;
  });

  const paginatedProducts = useComputed$(() => paginateProducts(filteredProducts.value, app.controls.currentPage, app.controls.itemsPerPage));

  return (
    <div>
      <header class="mb-8 border-l-4 border-term_accent pl-4">
        <h1 class="text-3xl font-bold uppercase mb-2">Hardware Deployment</h1>
        <p class="text-gray-400">Gereksiz özellik yok. Sadece sistem mühendisleri için optimize edilmiş donanımlar.</p>
      </header>
      <CatalogControls />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.value.length ? paginatedProducts.value.map((product) => <ProductCard key={product.id} product={product} />) : <div class="col-span-full py-10 text-center text-gray-500">Error 404: Hedef veri kümesi boş.</div>}
      </div>
      <Pagination currentPage={app.controls.currentPage} totalPages={totalPages.value} />
    </div>
  );
});
