import { component$, useComputed$, useContext } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { AppContext } from '../context/app-context';
import { addToCart } from '../lib/actions';
import { formatCurrency } from '../lib/format';
import { ImagePlaceholderIcon } from './icons';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export const ProductCard = component$<Props>(({ product }) => {
  const { app } = useContext(AppContext);
  const loc = useLocation();
  const detailHref = useComputed$(() => {
    const path = loc.url.pathname;
    const from = path.startsWith('/assembly')
      ? 'assembly'
      : path.startsWith('/electronic')
        ? 'electronic'
        : 'shop';
    return from === 'shop' ? `/product/${product.id}` : `/product/${product.id}?from=${from}`;
  });

  return (
    <div class="border border-term_dim p-5 hover:border-term_accent transition-all flex flex-col group bg-black">
      <Link
        href={detailHref.value}
        class="h-40 mb-4 border border-term_dim bg-term_dim/20 flex flex-col items-center justify-center text-term_dim group-hover:text-term_accent group-hover:border-term_accent transition-colors cursor-pointer overflow-hidden relative"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            class="w-full h-full object-contain bg-black p-2 pointer-events-none"
          />
        ) : (
          <>
            <ImagePlaceholderIcon class="w-10 h-10 mb-2 pointer-events-none" />
            <span class="text-[10px] tracking-widest uppercase opacity-70 pointer-events-none">[ IMG_DATA_STREAM ]</span>
          </>
        )}
      </Link>
      <div class="flex justify-between items-start mb-4">
        <span class="text-xs bg-term_dim text-gray-300 px-2 py-1 rounded-sm">{product.tag}</span>
        <span class="text-term_accent font-bold">{formatCurrency(product.price)}</span>
      </div>
      <Link
        href={detailHref.value}
        class="text-left text-lg font-bold mb-2 group-hover:text-term_accent transition-colors cursor-pointer"
      >
        {product.name}
      </Link>
      <p class="text-sm text-gray-400 mb-6 flex-grow">{product.desc}</p>
      <div class="flex gap-2 mt-auto">
        <Link
          href={detailHref.value}
          class="border border-term_dim py-2 flex-1 text-sm hover:text-term_accent hover:border-term_accent transition-all font-bold uppercase text-center"
        >
          [ Info ]
        </Link>
        <button
          type="button"
          onClick$={() => addToCart(app, product)}
          class="border border-term_dim py-2 flex-1 text-sm bg-term_dim hover:bg-term_accent hover:text-term_bg hover:border-term_accent transition-all font-bold uppercase tracking-widest"
        >
          [ Ekle ]
        </button>
      </div>
    </div>
  );
});
