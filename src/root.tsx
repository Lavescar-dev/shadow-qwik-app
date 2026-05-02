import { component$, useContextProvider, useStore, useTask$, useVisibleTask$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './router-head';
import { AppContext } from './context/app-context';
import { inventory, products } from './data/shared-inventory';
import { createInitialAssemblyState } from './lib/assembly-config';
import { createInitialElectronicsState } from './lib/electronics-actions';
import { getCategories } from './lib/catalog';
import type { AppStore, CartItem, Product } from './types';
import './global.css';

const categories = getCategories(products);

const CART_STORAGE_KEY = 'shadow-cart-v1';
type StoredCartEntry = { id: number; qty: number };

const readStoredCart = (): StoredCartEntry[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry): entry is StoredCartEntry =>
      entry && typeof entry.id === 'number' && typeof entry.qty === 'number',
    );
  } catch {
    return [];
  }
};

const hydrateCart = (entries: StoredCartEntry[], productsById: Record<number, Product>): CartItem[] =>
  entries.flatMap((entry) => {
    const product = productsById[entry.id];
    if (!product) return [];
    return [{ ...product, qty: Math.max(1, Math.min(99, entry.qty)) }];
  });

export default component$(() => {
  const app = useStore<AppStore>({
    controls: { searchQuery: '', category: 'ALL', sort: 'DEFAULT', currentPage: 1, itemsPerPage: 6 },
    cart: [],
    ui: {
      currentView: 'catalog',
      activeSection: 'shop',
      detailOriginSection: null,
      selectedProductId: null,
      cartOpen: false,
      processingPayment: false,
    },
    assembly: createInitialAssemblyState(),
    electronics: createInitialElectronicsState(),
    toasts: [],
    nextToastId: 1,
  });

  useContextProvider(AppContext, { app, products, categories, inventory });

  // Restore cart from localStorage on first client mount (SSR can't see window)
  useVisibleTask$(() => {
    if (app.cart.length > 0) return;
    const restored = hydrateCart(readStoredCart(), inventory.productsById);
    if (restored.length) app.cart.push(...restored);
  });

  // Persist cart on every mutation
  useTask$(({ track }) => {
    track(() => app.cart.map((item) => `${item.id}:${item.qty}`).join('|'));
    if (typeof window === 'undefined') return;
    try {
      const snapshot: StoredCartEntry[] = app.cart.map((item) => ({ id: item.id, qty: item.qty }));
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      /* quota exceeded or private mode — silent */
    }
  });

  return (
    <QwikCityProvider>
      <head>
        <RouterHead />
      </head>
      <body lang="tr">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
