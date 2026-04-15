import { component$, useContextProvider, useStore } from '@builder.io/qwik';
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
import type { AppStore } from './types';
import './global.css';

const categories = getCategories(products);

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
