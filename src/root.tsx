import { component$, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { AssemblyView } from './components/assembly/assembly-view';
import { CatalogView } from './components/catalog-view';
import { DetailView } from './components/detail-view';
import { CheckoutView } from './components/checkout-view';
import { CartOverlay } from './components/cart-overlay';
import { ElectronicsView } from './components/electronics/electronics-view';
import { ToastContainer } from './components/toasts';
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
    cart: hydrateCart(readStoredCart(), inventory.productsById),
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

  useContextProvider(AppContext, { app, products, categories, inventory });
  const isAssemblySection = app.ui.currentView === 'catalog' && app.ui.activeSection === 'assembly';
  const isElectronicsSection = app.ui.currentView === 'catalog' && app.ui.activeSection === 'electronic';
  const isWorkspaceSection = isAssemblySection || isElectronicsSection;

  return (
    <div class={['font-mono antialiased flex flex-col bg-term_bg text-term_fg selection:bg-term_accent selection:text-term_bg', isWorkspaceSection ? 'h-screen overflow-hidden' : 'min-h-screen']}>
      <Header />
      <main class={isElectronicsSection ? 'flex-grow min-h-0 w-full overflow-hidden' : isAssemblySection ? 'flex-grow min-h-0 w-full overflow-hidden' : 'flex-grow max-w-6xl mx-auto w-full p-4 mt-8'}>
        {app.ui.currentView === 'catalog' && !isElectronicsSection && !isAssemblySection && <CatalogView />}
        {isAssemblySection && <AssemblyView />}
        {isElectronicsSection && <ElectronicsView />}
        {app.ui.currentView === 'detail' && <DetailView />}
        {app.ui.currentView === 'checkout' && <CheckoutView />}
      </main>
      {!isWorkspaceSection && <Footer />}
      <CartOverlay />
      <ToastContainer />
    </div>
  );
});
